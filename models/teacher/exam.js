const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  startDate: { type: Date },
  endDate: { type:Date },
  name: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
  type: { 
    type: String,
    enum: ["mcq", "true_false", "classic"],
    required: true,
  },

  questions: [
    {
      question: { type: String, required: true },
      answers: [
        {
          type: String,
          required: function () {
            return this.type == "mcq";
          },
        },
      ],
      correctAnswer: { type: String,default:"" },
    },
  ],
});

module.exports = mongoose.model("exam", examSchema);
