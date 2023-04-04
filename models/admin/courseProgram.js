const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  video: { type: String },
});

module.exports = mongoose.model("Course", courseSchema);
