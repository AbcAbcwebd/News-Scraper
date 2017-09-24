// MONGODB_URI: mongodb://heroku_mftcp9cd:p080tnvhjjdcck6ulncce4uiis@ds149144.mlab.com:49144/heroku_mftcp9cd

// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressHandlebars = require("express-handlebars");
const cheerio = require("cheerio");
const request = require("request");
const Note = require("./models/Note.js");
const Article = require("./models/Article.js");

// Initialize Express
var app = express();

// Use body parser with our app
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// ROUTES

app.get("/scrape", function(req, res) {
	console.log("Scrape route hit")
  // First, we grab the body of the html with request
  request("https://www.nytimes.com/section/technology?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=Tech&WT.nav=page", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    console.log("HTML loaded");
    $(".story-link").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.headline = $(this).children(".story-meta").children(".headline").text().split("                    ")[1];
      result.link = $(this).attr("href");
      result.summary = $(this).children(".story-meta").children(".summary").text();
      result.byLine = $(this).children(".story-meta").children(".byline").text();

      console.log(result);

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      }); 

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});