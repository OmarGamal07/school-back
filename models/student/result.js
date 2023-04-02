const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'exam' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
  marks: { type: Number, default:0 },
  studentAnswer: [{ type: String }],
});

module.exports = mongoose.model('Result', resultSchema);