const mongoose = require("mongoose");

const homeworkResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    homeworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "homework",
      required: true,
    },
    note: { type: String, default: "" },
    result: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("homeworkResult", homeworkResultSchema);
