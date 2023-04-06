const express = require("express");
const router = express.Router();
require("dotenv").config();
//model
const courseModel = require("../../models/teacher/course");
const examModel = require("../../models/teacher/exam");
const resultModel = require("../../models/student/result");
const attendanceModel = require("../../models/student/attendance");
const noteModel = require("../../models/student/notes");
const student = require("../../middlewares/student/student");
const fs = require("fs");

// /student/enroll/:courseId/:studentId
router.patch("/enroll/:courseId/:studentId", [student], async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    const enroll = await courseModel.updateOne(
      { _id: courseId },
      { $push: { studentId: studentId } }
    );
    return res.send(enroll);
  } catch (e) {
    return res.send(e);
  }
});

module.exports = router;
