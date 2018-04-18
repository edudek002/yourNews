var db = require("../models");
//var app = require('express')()
var request = require("request");
var cheerio = require("cheerio");
var Note = require('../models/Note.js');
var Headline = require('../models/Headline.js');

module.exports = function(app) {
  
  app.get("/", function(req, res) {

    //REMOVE FILES FROM DATA
    /*
    db.Headline.remove({}).then(function(err, data) 
      
    {console.log("Inside callback");
      
    });
    */
    db.Headline.find({}, null, function(err, data) {
      if(data.length === 0) {
        res.render("info", {message: "There are no articles. Please type: http://localhost:3000/scrape to get articles, then press Back button."});
        res.redirect("/scrape");
      }
      else{  
        res.render("home", {articles: data});
      }
    });

  });


   // A GET route for scraping the website
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    db.Headline.remove({});
    request("http://people.com/news/", function(error, response, html) {
      var $ = cheerio.load(html); 

      $("article").each(function(i, element) {
       // Save an empty result object
        var result = {};

        var urls = $('article').children('a.media-img').children('div.lazy-image').get().map(article => article.attribs['data-src']);

        //!!!Peoples Magazine changes their HTML often. Try the two solutions below:
        // ===========DAY 1===============

        result.headline = $(this)
          .children("div.media-body")
          .children("div.headline")
          .children("a")
          .text();
        result.URL = "http://people.com" + $(this)
          .children("div.media-body")
          .children("div.headline")
          .children("a")
          .attr("href");
        result.image = urls[i];

        //console.log(" JSON result is " + JSON.stringify(result));
          
        // Create a new Headline using the `result` object built from scraping
        db.Headline.create(result)
          .then(function(dbHeadline) {
            // View the added result in the console
            console.log(dbHeadline);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
        
      });
      res.render("info", {message: "Scrape Complete. Please click the Back button to get to the main page."});
      console.log("Scrape Complete.");  
    });
  });


  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/note/:id", function(req, res) {
    
    db.Headline.findById(req.params.id)
    .populate("note")
    .exec(function(err, data) {

      if(data.length === 0) {
        res.render("info", {message: "Please write a note for this article."});
      }
      else{  
        res.render("home", {articles: data});
      }
    })
  })


  // Route for saving/updating an Article's associated Note
  app.post("/note/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbHeadline) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbHeadline);
        res.render("home", {articles: data});
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  

  /*app.get("/:id", function(req, res) {
    db.Headline.findById(req.params.id, function(err, data) {
      res.json(data);
    })
  });*/


  app.get("/saved", function(req, res) {
    db.Headline.find({issaved: true}, null, function(err, data) {
      if(data.length === 0) {
        res.render("info", {message: "No articles saved yet! Click the Back button to get to the main page."});
      }
      else {
        res.render("saved", {saved: data});
      }
    });
  });

  app.post("/save/:id", function(req, res) {
    db.Headline.findById(req.params.id, function(err, data) {
      if (data.issaved) {
        db.Headline.findByIdAndUpdate(req.params.id, {$set: {issaved: false, position: "Save Article"}}, {new: true}, function(err, data) {
          res.redirect("/");
        });
      }
      else {
        db.Headline.findByIdAndUpdate(req.params.id, {$set: {issaved: true, position: "Saved. Click to Unsave."}}, {new: true}, function(err, data) {
          res.redirect("/saved");
        });
      }
    });
  });

} 