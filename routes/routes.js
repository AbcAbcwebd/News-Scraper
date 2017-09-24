const express = require("express");
const router = express.Router();
const Note = require("../models/Note.js");
const Article = require("../models/Article.js");
const request = require("request");
const cheerio = require("cheerio");

router.get("/scrape", function(req, res) {
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
/*
router.get("/", function(req, res) {
	Article.find({})
	    // ..and string a call to populate the entry with the books stored in the library's books array
	    // This simple query is incredibly powerful. Remember this one!
	    .populate("notes")
	    // Now, execute that query
	    .exec(function(error, doc) {
	      // Send any errors to the browser
	      if (error) {
	        res.send(error);
	      }
	      // Or, send our results to the browser, which will now include the books stored in the library
	      else {
//	        res.render("home", {articles: doc});
          res.json(doc);
	      }
    });
});
*/
router.get("/", function(req, res) {
  Article.find({}, function(err, doc){
    res.render("home", {articles: doc});
  });
});

// Saves a note given the corresponding articles ID
router.post("/articles/:id", function(req, res) {
  // Use our Note model to make a new note from the req.body
  var newNote = new Note(req.body);
  // Save the new note to mongoose
  newNote.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise
    else {
      // Find our user and push the new note id into the User's notes array
      Article.update({_id: req.params.id}, { $push: { "notes": doc._id } }, { new: true }, function(err, newdoc) {
        // Send any errors to the browser
        if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(newdoc);
        }
      });
    }
  });
  console.log("Note saved")

});

router.get("/notes/:id", function(req, res) {
  Note.find({_id: req.params.id}, function(err, doc){
    res.json(doc);
  });
});

// Delete comment from a particular article
router.delete("/notes/:id/:index", function(req, res) {
  Article.find({ _id: req.params.id }, function(err, doc){
    if (!err){
      Article.update({ _id: req.params.id }, { $set: { notes: doc[0].notes.splice(req.params.index, 1) }}, function(error, upRes){
        if (error) {
          res.send(error);
        }
        else {
          res.send(upRes);
        }
      });
    };
  });
  
});

module.exports = router;