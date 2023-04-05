const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  Date: { type: Date, required: true },
  courseProgram: [
    { type: mongoose.Schema.Types.ObjectId, ref: "courseProgram" },
  ],
  notes: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "note" },
      note: { type: String },
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
