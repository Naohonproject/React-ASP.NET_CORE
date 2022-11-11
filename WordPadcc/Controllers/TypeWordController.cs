﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using WordPadcc.Models;
using Newtonsoft.Json;
using System.Linq;

namespace WordPadcc.Controllers
{
    [ApiController]
    [Route("/api")]
    public class TypeWordController : Controller
    {
        private readonly WordPadDbContext _wordPadDbContext;

        public TypeWordController(WordPadDbContext wordPadDbContext)
        {
            _wordPadDbContext = wordPadDbContext;
        }

        // GET: TypeWordController
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
            return Json(new { status = "write succuss" });
        }

        [HttpGet("{id}")]
        public IActionResult GetWord(string id)
        {
            var wordPads = _wordPadDbContext.WordPads;
            var wordPad = (from w in wordPads where w.Id == id select w).FirstOrDefault();
            if (wordPad == null)
            {
                return Json(new { status = "no found" });
            }
            else
            {
                return Json(wordPad);
            }
        }

        [HttpPut("url/{id}")]
        public async Task<IActionResult> UpdateUrl(string id)
        {
            string content;
            using (StreamReader stream = new StreamReader(Request.Body))
            {
                content = await stream.ReadToEndAsync();
            }
            var data = JsonConvert.DeserializeObject<WordPad>(content);

            var wordPads = _wordPadDbContext.WordPads;
            var wordPad = (from w in wordPads where w.Id == id select w).FirstOrDefault();

            wordPad.Url = data.Url;
            _wordPadDbContext.SaveChanges();
            return Json(data);
        }

        [HttpPut("password/{id}")]
        public async Task<IActionResult> UpdatePassword(string id)
        {
            string content;
            using (StreamReader stream = new StreamReader(Request.Body))
            {
                content = await stream.ReadToEndAsync();
            }
            var data = JsonConvert.DeserializeObject<WordPad>(content);

            var wordPads = _wordPadDbContext.WordPads;
            var wordPad = (from w in wordPads where w.Id == id select w).FirstOrDefault();

            wordPad.Password = data.Password;
            _wordPadDbContext.SaveChanges();
            return Json(data);
        }
    }
}