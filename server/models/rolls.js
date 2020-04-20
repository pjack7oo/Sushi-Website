var mongoose = require("mongoose");
var ImageSchema = require("./rollImage.js");
var Schema = mongoose.Schema;

var RollsSchema = new Schema({
  name: String,
  type: String,
  inner: [String],
  outer: [String],
  nori: Boolean,
  description: String,
  image: ImageSchema,
});

module.exports = mongoose.model("Rolls", RollsSchema);
