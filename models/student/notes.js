const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  note: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course",required : true },
  studentId: {type: mongoose.Schema.Types.ObjectId,ref: "user",required: true}
});

module.exports = mongoose.model("note", noteSchema);
