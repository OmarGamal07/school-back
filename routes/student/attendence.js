const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const attendanceModel = require("../../models/student/attendance");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin/admin");
const teacher = require("../../middlewares/teacher/teacher");
const student = require("../../middlewares/student/student");
const adminORteacher = require("../../middlewares/adminORteacher");
const courseModel = require("../../models/teacher/course");

// display all students attendence ---------------------

router.get("/", [adminORteacher], async (req, res) => {
  try {
    const attendance = await attendanceModel.find({}).populate("studentId");
    res.send(attendance);
  } catch (err) {
    res.send(err);
  }
});

// display attendence by id ---------------------

router.get("/:id", [adminORteacher], async (req, res) => {
  try {
    const id = req.params.id;
    const attendance = await attendanceModel.findById(id).populate("studentId");
    res.send(attendance);
  } catch (err) {
    res.send(err);
  }
});

// add attendence for student -----------------------

router.post("/", [student], async (req, res) => {
  if (!(req.body.studentId && req.body.courseId && req.body.date)) {
    return res.status(400).send("All inputs is required");
  }
  const attend = new attendanceModel({
    studentId: req.body.studentId,
    courseId: req.body.courseId,
    date: req.body.date,
    // status:false,
  });
  try {
    const saved = await attend.save();
    if (saved) {
      await courseModel.updateOne(
        { _id: req.body.courseId },
        { $push: { studentId: req.body.studentId } }
      );
    }
    res.send(saved);
  } catch (e) {
    res.send(e);
  }
});

// update attend for student

router.patch("/:id", [teacher], async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const attend = await attendanceModel.findByIdAndUpdate(id, updates);
    if (!attend) {
      res.status(404).send("attendence not found");
    }
    res.send(attend);
  } catch (e) {
    res.send(e);
  }
});

// delete attend for student

router.delete("/:id", [teacher], async (req, res) => {
  const id = req.params.id;
  try {
    const attend = await attendanceModel.findByIdAndDelete(id);
    if (!attend) {
      res.status(404).send("attendence not found");
    }
    res.send(attend);
  } catch (e) {
    res.send(e);
  }
});

// display all students attendence ---------------------
// /attendence/course/courseId
router.get("/course/:id", [admin], async (req, res) => {
  try {
    const id = req.params.id;
    const attendance = await attendanceModel
      .find({ courseId: id })
      .populate("studentId")
      .populate("courseId");
    res.send(attendance);
  } catch (err) {
    res.send(err);
  }
});

// router.get("/student/:id", [admin], async (req, res) => {
//   try {
//     const id = req.params.id;
//     const attendance = await attendanceModel
//       .find({ studentId: id })
//       .populate("studentId")
//       .populate("courseId");
//     res.send(attendance);
//   } catch (err) {
//     res.send(err);
//   }
// });

router.get("/:courseId/:studentId", [admin], async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    const attendance = await attendanceModel
      .find({ studentId: studentId, courseId: courseId })
      .populate("studentId")
      .populate("courseId");
    res.send(attendance);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
