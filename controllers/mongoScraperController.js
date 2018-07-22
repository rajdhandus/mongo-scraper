const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
const mongoose = require("mongoose");
const Article = require("../models/Article");

const router = express.Router();

router.get("/", function(req, res) {
  var respData = {
    articles: [
      {
        header: "U.S. Releases Surveillance Records of Ex-Trump Aide",
        url:
          "https://www.nytimes.com/2018/07/21/us/politics/carter-page-fisa.html",
        body:
          "The release offered a rare glimpse of national security wiretap files and raised echoes of a fight in February over the Russia inquiry between Republicans and Democrats on the House Intelligence Committee."
      }
    ]
  };
  res.render("index", respData);
  // res.render("index");
});

mongoose.connect("mongodb://localhost/articlesDB");

router.get("/scrape", function(req, res) {
  request("https://news.ycombinator.com/", function(error, response, html) {
    var $ = cheerio.load(html);
    $(".title").each(function(i, element) {
      var title = $(element)
        .children("a")
        .text();
      var link = $(element)
        .children("a")
        .attr("href");

      if (title && link) {
        console.log("title " + title);
        console.log("link " + link);
        Article.create(
          {
            header: title,
            link: link,
            body: title
          },
          function(err, small) {
            if (err) {
              // return handleError(err);
              // res.send(err);
              console.log("record create failed");
            }
            // saved!
          }
        );
      }
    });
    res.send("Scrape Complete");
  });
});

router.get("/api/fetch", function(req, res) {
  var respData = [
    {
      header: "U.S. Releases Surveillance Records of Ex-Trump Aide",
      url:
        "https://www.nytimes.com/2018/07/21/us/politics/carter-page-fisa.html",
      body:
        "The release offered a rare glimpse of national security wiretap files and raised echoes of a fight in February over the Russia inquiry between Republicans and Democrats on the House Intelligence Committee."
    }
  ];
  res.render("index", respData);
  // res.json(respData);
});

module.exports = router;
