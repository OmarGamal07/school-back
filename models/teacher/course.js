const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  studentId: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  Date: {
    type: Date,
    required: true,
    match: /^[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/,
  },
  courseProgram: [
    { type: mongoose.Schema.Types.ObjectId, ref: "courseProgram" },
  ],
  notes: [
    {
      noteId: { type: mongoose.Schema.Types.ObjectId, ref: "note" },
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
