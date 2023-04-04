const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user',required:true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'user',required:true },
  status: { type: Boolean, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Attendance', attendanceSchema);