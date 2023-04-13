const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema({
  startDate: { type: Date },
  endDate: { type: Date },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  courseProgramId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseProgram",
    required: true,
  },
  note: { type: String, default: "" },
  file: { type: String, required: true },
});

module.exports = mongoose.model("homework", homeworkSchema);
