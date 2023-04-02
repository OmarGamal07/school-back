const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  courseProgram: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourseProgram' }],
  notes: [{ studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, note: { type: String } }],
});

module.exports = mongoose.model('Course', courseSchema);