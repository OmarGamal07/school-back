const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'exam' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  result: { type: Number, default:0 },
  isClassic:{type:Boolean,default:false},
  studentAnswer: [{ 
    question:{type:String,required:true},
    answer:{type:String}
   }],
});

module.exports = mongoose.model('result', resultSchema);