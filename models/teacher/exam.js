const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  name: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
  type: {
    type: String,
    enum: ["mcq", "true_false", "classic"],
    required:true
  },
  // questions: [
//     {question:{ type: String, required: true }},
//     {
//       answers: { 
//       type: [String],
//       required:()=>{
//         return this.type == 'mcq';
//     }
//   }
// },
// {
//   correctAnswer:{type:String}
// }

questions:[
  {
  question:{ type: String, required: true },
  answers: [
    { 
      type:String,
      required:()=>{
        return this.type == 'mcq';
    }
  }],
      correctAnswer:{type:String,required:true}
  }]
});

module.exports = mongoose.model('exam', examSchema);