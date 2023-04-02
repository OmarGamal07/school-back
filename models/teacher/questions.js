const mongoose = require('mongoose');
const examModel = require('./exam');
const questionSchema = new mongoose.Schema({
  questions: [{ type: String, required: true }],
  answers: { 
    type: [String],
    required:()=>{
        return examModel.type == 'mcq';
    }
  },
  correctAnswer:{type:String}
});

module.exports = mongoose.model('question', questionSchema);
answer:{true,false}

answer:{a,b,c}

answer:{}