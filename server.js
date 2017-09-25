// MONGODB_URI: mongodb://heroku_mftcp9cd:p080tnvhjjdcck6ulncce4uiis@ds149144.mlab.com:49144/heroku_mftcp9cd

// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const cheerio = require("cheerio");
const request = require("request");

// Initialize Express
const app = express();

// Defines port
const PORT = process.env.PORT || 5000;

// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_mftcp9cd:p080tnvhjjdcck6ulncce4uiis@ds149144.mlab.com:49144/heroku_mftcp9cd"); // mongodb://localhost/news-scraper-db
const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// ROUTES
const routes = require("./routes/routes.js");
app.use("/", routes);

// Listener
app.listen(PORT, function() {
  console.log("App running on port 3000!");
});