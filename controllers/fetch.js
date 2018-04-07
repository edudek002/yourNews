var db = require("../models");
var request = require("request");
var cheerio = require("cheerio");
var Note = require('../models/Note.js');
var Headline = require('../models/Headline.js');

module.exports = function(app) {
  
  app.get("/", function(req, res) {
    db.Headline.find({}, null, function(err, data) {
      if(data.length === 0) {
        res.render("info", {message: "There are no articles. Please type: http://localhost:3000/scrape to get articles."});
      }
      else{  
        res.render("home", {articles: data});
      }
    });
  });

  // A GET route for scraping the website
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("http://people.com/news/", function(error, response, html) {
      var $ = cheerio.load(html);      
      $("article").each(function(i, element) {
       // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.headline = $(this)
          .children("h3 a")
          .text();
        result.URL = $(this)
          .children("h3 a")
          .attr("href");
        result.image = $(this)
          .children("a img")
          .attr("href");
        
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
          //console.log(db.Headline.create)
      });
      res.send("Scrape Complete. Please type: http://localhost:3000 to get to the main page.");
      console.log("Scrape Complete.");
      //res.redirect("/");  
    });
  });


  app.get("/:id", function(req, res) {
    db.Headline.findById(req.params.id, function(err, data) {
      res.json(data);
    })
  });


  app.get("/saved", function(req, res) {
    db.Headline.find({issaved: true}, null, function(err, data) {
      if(data.length === 0) {
        res.render("info", {message: "No articles saved."});
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
        db.Headline.findByIdAndUpdate(req.params.id, {$set: {issaved: true, position: "Saved"}}, {new: true}, function(err, data) {
          res.redirect("/saved");
        });
      }
    });
  });

  app.post("/note/:id", function(req, res) {
    var note = new Note(req.body);
    note.save(function(err, doc) {
      if (err) throw err;
      db.Headline.findByIdAndUpdate(req.params.id, {$set: {"note": doc._id}}, {new: true}, function(err, newdoc) {
        if (err) throw err;
        else {
          res.send(newdoc);
        }
      });
    });
  });

  app.get("/note/:id", function(req, res) {
    var id = req.params.id;
    db.Headline.findById(id).populate("note").exec(function(err, data) {
      res.send(data.note);
    })
  })

} 