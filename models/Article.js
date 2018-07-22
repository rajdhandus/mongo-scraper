const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  header: {
    type: String,
    trim: true,
    required: "Article Header is Required"
  },

  link: {
    type: String,
    trim: true,
    match: [
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
      "Please enter a valid URL"
    ],
    required: "Article link is Required"
  },

  body: {
    type: String,
    unique: true,
    required: "Article Body is Required"
  }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
