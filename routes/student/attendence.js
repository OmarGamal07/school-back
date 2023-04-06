const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const attendanceModel = require("../../models/student/attendance");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin/admin");
const teacher = require("../../middlewares/teacher/teacher");

// display all students attendence ---------------------

router.get("/", [admin], async (req, res) => {
  try {
    const attendance = await attendanceModel.find({}).populate("studentId");
    res.send(attendance);
  } catch (err) {
    res.send(err);
  }
});

// display attendence by id ---------------------

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const attendance = await attendanceModel.findById(id).populate("studentId");
    res.send(attendance);
  } catch (err) {
    res.send(err);
  }
});

// add attendence for student -----------------------

router.post("/", [teacher], async (req, res) => {
  if (
    !(
      req.body.studentId &&
      req.body.courseId &&
      req.body.status &&
      req.body.date
    )
  ) {
    res.status(400).send("All inputs is required");
  }
  const attend = new attendanceModel({
    studentId: req.body.studentId,
    courseId: req.body.courseId,
    status: req.body.status,
    date: req.body.date,
  });
  try {
    await attend.save();
    res.send(attend);
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
      .populate("studentId");
    res.send(attendance);
  } catch (err) {
    res.send(err);
  }
});

router.get("/student/:id", [admin], async (req, res) => {
  try {
    const id = req.params.id;
    const attendance = await attendanceModel
      .find({ studentId: id })
      .populate("studentId");
    res.send(attendance);
  } catch (err) {
    res.send(err);
  }
});



module.exports = router;
