//Node dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");


var Promise = require("bluebird");

mongoose.Promise = Promise;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/yourNews";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB

mongoose.connect(MONGODB_URI);


var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Use express.static to serve the public folder as a static directory
app.use(express.static("./public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Routes
require("./controllers/fetch.js")(app);

// Show Mongoose errors
mongoose.connection.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Once logged in to the db through mongoose, log a success message
mongoose.connection.once('open', function() {
  console.log('Mongoose connection successful.');
});

// Import the Comment and Article models
var Headline = require('./models/Headline.js');
var Note = require('./models/Note.js');


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
