using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using WordPadcc.Models;
using Newtonsoft.Json;
using System.Linq;
using System.Net;

namespace WordPadcc.Controllers
{
    [ApiController]
    [Route("api")]
    public class TypeWordController : Controller
    {
        // declare dependency
        private readonly WordPadDbContext _wordPadDbContext;

        // inject dbContext by constructor.This dependency inject by Runtime by add WordPadDbContext service in startup class
        public TypeWordController(WordPadDbContext wordPadDbContext)
        {
            _wordPadDbContext = wordPadDbContext;
        }

        // Access Modifier : Public
        // EndPoint: POST /api/
        // Desc: post a new note to db
        // Additional Desc : check whether the incoming request post with note key exist in db or not.If existed, return false status with message.If not existed , add that note to database then response to client the note they recently post
        [HttpPost]
        public async Task<IActionResult> PostWord()
        {
            var body = Request.Body;
            string content;
            using (StreamReader stream = new StreamReader(body))
            {
                content = await stream.ReadToEndAsync();
            }
            var data = JsonConvert.DeserializeObject<WordPad>(content);
            var wordPads = _wordPadDbContext.WordPads;
            var existWordPad = (
                from wp in wordPads
                where wp.Id == data.Id
                select wp
            ).FirstOrDefault();
            if (existWordPad != null)
            {
                return Json(new { status = false, message = "data exist in db" });
            }
            wordPads.Add(data);
            _wordPadDbContext.SaveChanges();
            return Json(data);
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
        public IActionResult GetWord(string url)
        {
            var wordPads = _wordPadDbContext.WordPads;
            var wordPad = (from w in wordPads where w.Url == url select w).FirstOrDefault();

            if (wordPad == null)
            {
                return Json(new { status = false, message = "not found" });
            }
            else if (wordPad.Password != "")
            {
                if (HttpContext.Session.GetString($"{url}") == $"{url}")
                {
                    return Json(
                        new
                        {
                            Id = wordPad.Id,
                            Url = wordPad.Url,
                            Content = wordPad.Content,
                            IsModified = wordPad.IsModified,
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
                        Id = wordPad.Id,
                        Url = wordPad.Url,
                        Content = wordPad.Content,
                        IsModified = wordPad.IsModified,
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
        public async Task<IActionResult> UpdateUrl(string id)
        {
            var wordPads = _wordPadDbContext.WordPads;
            string content;
            using (StreamReader stream = new StreamReader(Request.Body))
            {
                content = await stream.ReadToEndAsync();
            }
            var data = JsonConvert.DeserializeObject<WordPad>(content);

            // find wordPad data by Id
            var wordPad = (from wb in wordPads where wb.Id == id select wb).FirstOrDefault();
            // wordPad != null, mean this wordPad was saved before,return new one after change the database
            if (wordPad == null)
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
            // mean, just when use travel to website, did not create any thing, wordPad did create in data base, just response what they send
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

                // find wordPad by Url to check whether the sent url is exist or not in database
                var wordPad2 = (
                    from wb in wordPads
                    where wb.Url == data.Url
                    select wb
                ).FirstOrDefault();
                // if Existed, Response ErrorMessage
                if (wordPad2 != null)
                {
                    return Json(
                        new
                        {
                            status = false,
                            errorMessage = "That one is already in use, please try a different one."
                        }
                    );
                }
                wordPad.Url = data.Url;
                _wordPadDbContext.SaveChanges();
                return Json(new { status = true, Id = wordPad.Id, Url = wordPad.Url });
            }
        }

        // Access Modified : Public
        // EndPoint : Put api/content/:id
        // Desc : To Update content of the note in Database
        [HttpPut("content/{id}")]
        public async Task<IActionResult> UpdateContent(string id)
        {
            if (HttpContext.Session.GetString("isAuth") == "no")
            {
                return Content("No Auth");
            }
            var wordPads = _wordPadDbContext.WordPads;
            string content;
            using (StreamReader stream = new StreamReader(Request.Body))
            {
                content = await stream.ReadToEndAsync();
            }
            var data = JsonConvert.DeserializeObject<WordPad>(content);

            var wordPad = (from wb in wordPads where wb.Id == id select wb).FirstOrDefault();

            if (wordPad != null)
            {
                wordPad.Content = data.Content;
                wordPad.IsModified = true;
                _wordPadDbContext.SaveChanges();
                return Json(wordPad);
            }
            else
            {
                return Json(new { message = "Not Found" });
            }
        }

        // Access Modified : Public
        // EndPoint : Put api/password/:id
        // Desc : To Update Password of the note in Database
        [HttpPut("password/{id}")]
        public async Task<IActionResult> UpdatePassword(string id)
        {
            string content;
            using (StreamReader stream = new StreamReader(Request.Body))
            {
                content = await stream.ReadToEndAsync();
            }
            var data = JsonConvert.DeserializeObject<Password>(content);

            var wordPads = _wordPadDbContext.WordPads;
            var wordPad = (from w in wordPads where w.Id == id select w).FirstOrDefault();
            if (wordPad == null)
            {
                return Json(new { status = false, message = "not found" });
            }
            wordPad.Password = data.UserPassword;
            _wordPadDbContext.SaveChanges();
            return Json(
                new
                {
                    Id = wordPad.Id,
                    Url = wordPad.Url,
                    Content = wordPad.Content,
                    IsModified = wordPad.IsModified
                }
            );
        }

        // Access Modified : Public
        // EndPoint : Put api/auth/:url
        // Desc : To Authenticate Password of the note in Database
        [HttpPost("auth/{url}")]
        public async Task<IActionResult> Authenticate(string url)
        {
            string content;
            using (StreamReader stream = new StreamReader(Request.Body))
            {
                content = await stream.ReadToEndAsync();
            }
            var data = JsonConvert.DeserializeObject<Password>(content);
            var wordPads = _wordPadDbContext.WordPads;
            var wordPad = (from w in wordPads where w.Url == url select w).FirstOrDefault();

            if (wordPad == null)
            {
                return Json(new { status = false, message = "not found" });
            }

            if (wordPad.Password == data.UserPassword)
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
        public IActionResult ResetPassword(string url)
        {
            var wordPads = _wordPadDbContext.WordPads;
            var wordPad = (from w in wordPads where w.Url == url select w).FirstOrDefault();
            if (wordPad == null)
            {
                return Json(new { status = false, message = "not found" });
            }
            else
            {
                wordPad.Password = "";
                HttpContext.Session.Remove($"{url}");
                _wordPadDbContext.SaveChanges();
                return Json(new { status = true, message = "reset successfully" });
            }
        }
    }
}
