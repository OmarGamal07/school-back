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
const teacherModel = require("../../models/user");
const fs = require("fs");



router.get("/", async (req, res) => {
    try {
      const teacherId = req.params.teacherId;
      const teacher = await teacherModel.find({role:"teacher"});
      return res.send(teacher);
    } catch (e) {
      return res.send(e);
    }
  });
  
  module.exports = router;