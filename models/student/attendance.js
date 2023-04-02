const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student',required:true },
  status: { type: Boolean, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Attendance', attendanceSchema);