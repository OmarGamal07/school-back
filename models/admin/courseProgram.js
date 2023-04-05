const mongoose = require("mongoose");

const courseProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

module.exports = mongoose.model("courseProgram", courseProgramSchema);
