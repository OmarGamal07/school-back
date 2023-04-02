const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  name: { type: String, required: true },
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