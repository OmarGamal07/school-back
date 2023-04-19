const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const homeworkResultModel = require("../../models/student/homeworkResult");
const auth = require("../../middlewares/auth");
const teacher = require("../../middlewares/teacher/teacher");
const student = require("../../middlewares/student/student");
const upload = require("../../middlewares/upload");
const courseModel = require("../../models/teacher/course");
const fs = require("fs");
const admin = require("../../middlewares/admin/admin");
const adminOrTeacher = require("../../middlewares/adminORteacher");

// get all homeworkResults
router.get("/", [teacher], async (req, res) => {
  try {
    const homework = await homeworkResultModel
      .find({})
      .populate({
        path: "homeworkId",
        populate: { path: "courseProgramId" },
      })
      .populate("studentId");
    res.send(homework);
  } catch (err) {
    res.send(err);
  }
});

// get homeowrk by id
router.get("/:id", [teacher], async (req, res) => {
  try {
    const id = req.params.id;
    const homeworkResult = await homeworkResultModel
      .findById(id)
      .populate({
        path: "homeworkId",
        populate: { path: "courseProgramId" },
      })
      .populate("studentId");
    res.send(homeworkResult);
  } catch (err) {
    res.send(err);
  }
});
// get home work results for student
router.get("/all/:studentId", [auth], async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const homeworkResults = await homeworkResultModel
      .find({ studentId: studentId })
      .populate({
        path: "homeworkId",
        populate: { path: "courseProgramId" },
      })
      .populate("studentId");
    res.send(homeworkResults);
  } catch (err) {
    res.send(err);
  }
});
// add homeowrkResult
router.post("/", [teacher], async (req, res) => {
  try {
    const result = new homeworkResultModel({
      studentId: req.body.studentId,
      homeworkId: req.body.homeworkId,
      note: req.body.note,
      result: Number(req.body.result),
    });
    await result.save();
    if (result) {
      return res.send(result);
    } else {
      return res.status(500);
    }
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
