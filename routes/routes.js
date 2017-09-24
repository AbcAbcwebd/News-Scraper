const express = require("express");
const router = express.Router();
const Note = require("../models/Note.js");
const Article = require("../models/Article.js");

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
	        res.render("home", doc);
	      }
    });
});

module.exports = router;