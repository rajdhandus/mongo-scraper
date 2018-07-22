const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const bodyParser = require("body-parser");
const mongoScraperController = require("./controllers/mongoScraperController");

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(mongoScraperController);
app.use(express.static("public"));

app.listen(PORT, function() {
  console.log("Server is up and running on " + PORT);
});
