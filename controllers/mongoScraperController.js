const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
const mongoose = require("mongoose");
const Article = require("../models/Article");
var db = require("../models");

mongoose.connect("mongodb://localhost/articlesDB");

const router = express.Router();

router.get("/", function(req, res) {
  var aritclesData = { articles: [] };

  Article.find({})
    .then(function(dbArticle) {
      console.log(dbArticle);
      aritclesData.articles = dbArticle;
      res.render("index", aritclesData);
      // res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  // res.render("index", respData);
  // res.render("index");
});

router.get("/api/notes/:id", function(req, res) {
  let id = req.params.id;
  db.Note.find({ _headlineId: id })
    .then(function(dbNote) {
      console.log(dbNote);
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.post("/api/notes", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      console.log(dbNote);
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.delete("/api/notes/:id", function(req, res) {
  let id = req.params.id;
  db.Note.remove({ _id: id })
    .then(function(dbNote) {
      console.log(dbNote);
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.delete("/api/headlines/:id", function(req, res) {
  let id = req.params.id;
  db.Article.remove({ _id: id })
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/api/headlines/clear", function(req, res) {
  Article.remove({}, function(err, response) {
    if (err) {
      console.log(
        "error happened while removing all documents from collection"
      );
      res.send(err);
    }
    res.render("index", null);
  });
});

router.get("/api/headlines", function(req, res) {
  console.log(req.query.saved);
  var aritclesData = { articles: [] };

  Article.find({ saved: req.query.saved })
    .then(function(dbArticle) {
      aritclesData.articles = dbArticle;
      if (req.query.saved) {
        res.json(aritclesData);
      } else {
        res.json(aritclesData);
      }
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/saved", function(req, res) {
  Article.find({ saved: true })
    .then(function(dbArticle) {
      console.log(dbArticle);
      var aritclesData = { articles: dbArticle };

      res.render("saved", aritclesData);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/api/headlines/:id/save", function(req, res) {
  console.log(req.params.id);
  let id = req.params.id;
  Article.findByIdAndUpdate(id, { saved: true })
    .then(function(dbArticle) {
      console.log("find and update successful");
      res.json(dbArticle);
    })
    .catch(function(err) {
      console.log("find and update not successful");

      res.json(err);
    });
});

router.get("/api/headlines/scrape", function(req, res) {
  request("https://news.ycombinator.com/", function(error, response, html) {
    var $ = cheerio.load(html);
    var aritclesData = { articles: [] };
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
        let article = {
          header: title,
          link: link,
          body: title
        };
        Article.create(article, function(err, small) {
          if (err) {
            console.log(i + " record create failed " + err, article);
          }
          aritclesData.articles.push(article);
        });
      }
    });
    res.json(aritclesData);
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
