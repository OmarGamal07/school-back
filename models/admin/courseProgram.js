const mongoose = require("mongoose");

const courseProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  homework: {
    startDate: { type: Date },
    endDate: { type: Date },
    homeworkDescription: { type: String },
  },
});

module.exports = mongoose.model("courseProgram", courseProgramSchema);
