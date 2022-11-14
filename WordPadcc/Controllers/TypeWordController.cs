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
        private readonly WordPadDbContext _wordPadDbContext;

        public TypeWordController(WordPadDbContext wordPadDbContext)
        {
            _wordPadDbContext = wordPadDbContext;
        }

        // access : public
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
            wordPads.Add(data);
            _wordPadDbContext.SaveChanges();
            return Json(data);
        }

        // access: private
        [HttpGet("{id}")]
        public IActionResult GetWord(string id)
        {
            var wordPads = _wordPadDbContext.WordPads;
            var wordPad = (from w in wordPads where w.Url == id select w).FirstOrDefault();

            if (wordPad == null)
            {
                return Json(new { status = false, message = "not found" });
            }
            else if (wordPad.Password != "")
            {
                if (HttpContext.Session.GetString("isAuth") == "yes")
                {
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
                else
                {
                    return Json(new { status = false, message = "not authenticate" });
                }
            }
            else
            {
                return Json(wordPad);
            }
        }

        // access : private
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

        // access public
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

        // access public
        // desc : set Password
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

            wordPad.Password = data.UserPassword;
            _wordPadDbContext.SaveChanges();
            HttpContext.Session.SetString("isAuth", "no");
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

        [HttpPost("auth/{id}")]
        public async Task<IActionResult> Authenticate(string id)
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

            if (wordPad.Password == data.UserPassword)
            {
                HttpContext.Session.SetString("isAuth", "yes");
                return Json(new { isAuth = true });
            }
            else
            {
                return Json(new { isAuth = false });
            }
        }

        [HttpPut("reset/{id}")]
        public IActionResult ResetPassword(string id)
        {
            var wordPads = _wordPadDbContext.WordPads;
            var wordPad = (from w in wordPads where w.Url == id select w).FirstOrDefault();
            wordPad.Password = "";
            HttpContext.Session.Remove("isAuth");
            _wordPadDbContext.SaveChanges();
            return Json(new { status = true, message = "reset successfully" });
        }
    }
}
