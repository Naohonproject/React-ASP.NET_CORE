using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WordPadcc.Models;
using System.Linq;
using Utils;
using BC = BCrypt.Net.BCrypt;
using System;

namespace WordPadcc.Controllers
{
    [ApiController]
    [Route("api")]
    public class TypeWordController : Controller
    {
        // declare dependency
        private readonly WordPadDbContext _db;

        // inject dbContext by constructor.This dependency inject by Runtime by add WordPadDbContext service in startup class
        public TypeWordController(WordPadDbContext wordPadDbContext)
        {
            _db = wordPadDbContext;
        }

        // Access Modifier : Public
        // EndPoint: POST /api/
        // Desc: post a new note to db
        // Additional Desc : check whether the incoming request post with note key exist in db or not.If existed, return false status with message.If not existed , add that note to database then response to client the note they recently post
        [HttpPost]
        public async Task<IActionResult> PostWord(WordPad data)
        {
            var existedNote = _db.WordPads.FirstOrDefault(n => n.Url == data.Url);

            if (existedNote != null)
            {
                return Json(new { status = false, message = "data exist in db" });
            }
            _db.WordPads.Add(data);
            await _db.SaveChangesAsync();
            return Json(data);
        }

        // Access: public
        // EndPoint : GET /api/share/:url
        // Desc : This EndPoint to get note from server
        [HttpGet("share/{url}")]
        public IActionResult GetShareNote(string url)
        {
            var note = _db.WordPads.FirstOrDefault(n => n.Url == url);
            if (note == null)
            {
                return Json(new { status = false, message = "not found" });
            }
            return Json(new { Content = note.Content });
        }

        // Access: Private
        // EndPoint : GET api/:url
        // Desc : This EndPoint to get note from server
        // Additional Desc : This endpoint firstly check the note exist in db or not:
        //                      If note does not exist, response to client with status: false and message: not found
        //                      If note exist in database, check whether that note has password or not:
        //                          If it has password , check whether incoming request url equal to url in session or not:
        //                              If true, response to client that note data without password and hasPassword: true
        //                              If false, response to client status:false and message:not authenticate
        //                          If i has no password , response to client that note data with hasPassword : false
        [HttpGet("{url}")]
        public IActionResult GetNote(string url)
        {
            var note = _db.WordPads.FirstOrDefault(n => n.Url == url);
            if (note == null)
            {
                return Json(new { status = false, message = "not found" });
            }
            else if (note.Password != "")
            {
                if (HttpContext.Session.GetString($"{url}") == $"{url}")
                {
                    return Json(
                        new
                        {
                            Id = note.Id,
                            Url = note.Url,
                            Content = note.Content,
                            IsModified = note.IsModified,
                            HasPassword = true
                        }
                    );
                }
                else
                {
                    return Json(new { status = false, message = "not authenticate" });
                }
            }
            else
            {
                return Json(
                    new
                    {
                        Id = note.Id,
                        Url = note.Url,
                        Content = note.Content,
                        IsModified = note.IsModified,
                        HasPassword = false
                    }
                );
            }
        }

        // Access Modified : Public
        // EndPoint : Put api/url/:id
        // Desc : To change the note Url in Database
        // Additional Desc : This action will read data from incoming request, then check that note exist in db or not:
        //                      - If the note does not exist:
        //                          + check Url Incoming request:
        //                                  if Url==""(empty), response status:false and errorMessage: An error occurred, please try again later.
        //                                  if Url !="", response to client the new Url and Id,this let Client update there Url,Id but not write to database yet
        //                      - If the note do exist :
        //                          + check Url Incoming request:
        //                                 if Url==""(empty), response status:false and errorMessage: An error occurred, please try again later.
        //                                 if Url !="", change that note's Url and Update database, return the new Url and Id of the note to client
        [HttpPut("url/{id}")]
        public async Task<IActionResult> UpdateUrl(string id, WordPadClone data)
        {
            // find note data by Id
            var note = _db.WordPads.FirstOrDefault(n => n.Id == id);
            // wordPad != null, mean this wordPad was saved before,return new one after change the database
            if (note == null)
            {
                if (data.Url == "")
                {
                    return Json(
                        new
                        {
                            status = false,
                            errorMessage = "An error occurred, please try again later."
                        }
                    );
                }
                return Json(new { status = true, Id = data.Id, Url = data.Url });
            }
            // mean, just when user travel to website, did not create any thing, note did create in data base, just response what they send
            else
            {
                // new Url is empty, response error message
                if (data.Url == "")
                {
                    return Json(
                        new
                        {
                            status = false,
                            errorMessage = "An error occurred, please try again later."
                        }
                    );
                }

                // find note by Url to check whether the sent url is exist or not in database
                var noteWithExistedUrl = _db.WordPads.FirstOrDefault(n => n.Url == data.Url);
                // if Existed, Response ErrorMessage
                if (noteWithExistedUrl != null)
                {
                    return Json(
                        new
                        {
                            status = false,
                            errorMessage = "That one is already in use, please try a different one."
                        }
                    );
                }
                note.Url = data.Url;
                await _db.SaveChangesAsync();
                return Json(new { status = true, Id = note.Id, Url = note.Url });
            }
        }

        // Access Modified : Public
        // EndPoint : Put api/content/:id
        // Desc : To Update content of the note in Database
        [HttpPut("content/{url}")]
        public async Task<IActionResult> UpdateContent(string url, WordPad data)
        {
            var note = _db.WordPads.FirstOrDefault(n => n.Url == url);

            if (note != null)
            {
                note.Content = data.Content;
                note.IsModified = true;
                await _db.SaveChangesAsync();
                return Json(note);
            }
            else
            {
                return Json(new { status = false, message = "Not Found" });
            }
        }

        // Access Modified : Public
        // EndPoint : Put api/password/:id
        // Desc : To Update Password of the note in Database
        [HttpPut("password/{url}")]
        public async Task<IActionResult> UpdatePassword(string url, Password password)
        {
            int length = password.UserPassword.Length;
            // validate password
            if (password.UserPassword.Length < 6)
            {
                return Json(
                    new
                    {
                        status = false,
                        errorMessage = "Password length must be at least 6 characters"
                    }
                );
            }
            // validate password ok! find that note in database
            var note = _db.WordPads.FirstOrDefault(n => n.Url == url);
            // if note does not exist in data base return status = false and message = "not found"
            if (note == null)
            {
                return Json(new { status = false, errorMessage = "not found" });
            }

            // generate salt
            int factor = ((DateTime.Now.Year - 2000) / 2 - 6);
            string salt = BC.GenerateSalt(factor);

            // hashing password
            string hashedUserPassword = BC.HashPassword(password.UserPassword, salt);

            // update password in DbContext
            note.Password = hashedUserPassword;
            // Call SaveChangeAsync to save changes to database
            await _db.SaveChangesAsync();
            // return the database's note data without
            return Json(
                new
                {
                    Id = note.Id,
                    Url = note.Url,
                    Content = note.Content,
                    IsModified = note.IsModified
                }
            );
        }

        // Access Modified : Public
        // EndPoint : Put api/auth/:url
        // Desc : To Authenticate Password of the note in Database
        [HttpPost("auth/{url}")]
        public IActionResult Authenticate(string url, Password password)
        {
            var note = _db.WordPads.FirstOrDefault(n => n.Url == url);
            if (note == null)
            {
                return Json(new { status = false, message = "not found" });
            }

            if (note.Password == password.UserPassword)
            {
                HttpContext.Session.SetString($"{url}", $"{url}");
                return Json(new { isAuth = true });
            }
            else
            {
                return Json(new { isAuth = false });
            }
        }

        // Access Modified : Public
        // EndPoint : Put api/reset/:url
        // Desc : To remove Password of the note in Database
        [HttpPut("reset/{url}")]
        public async Task<IActionResult> ResetPassword(string url)
        {
            var note = _db.WordPads.FirstOrDefault(n => n.Url == url);
            if (note == null)
            {
                return Json(new { status = false, message = "not found" });
            }
            else
            {
                note.Password = "";
                HttpContext.Session.Remove($"{url}");
                await _db.SaveChangesAsync();
                return Json(new { status = true, message = "reset successfully" });
            }
        }
    }
}
