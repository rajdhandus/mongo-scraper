var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  noteText: String,
  date: Date,
  _headlineId: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
