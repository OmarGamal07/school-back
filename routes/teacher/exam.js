const express = require("express");
const router = express.Router();
require("dotenv").config();
//model
const courseModel = require("../../models/teacher/course");
const examModel = require("../../models/teacher/exam");
const student = require("../../middlewares/student/student");
const teacherModel = require("../../models/user");
const fs = require("fs");
const teacher = require("../../middlewares/teacher/teacher");
const admin = require("../../middlewares/admin/admin");
const moment = require('moment');
router.get("/mangeExam", async (req, res) => {
  try {
    const exam = await examModel.find({
      $or: [
        { startDate: { $exists: false } }, // Fetch exams without start date
        { endDate: { $exists: false } }, // Fetch exams without end date
        ]});
    return res.status(200).send(exam);
  } catch (err) {
    res.status(500).send(err);
  }
});
// put exam by id
router.patch("/mangeExam/:id",async (req, res) => {
  try {
    const endDateISO = req.body.endDate; // Replace with the value received from front-end
    const endDate = moment.utc(endDateISO); // Create a moment object in UTC time zone
    const endDateLocal = endDate.local(); // Convert to local time zon
const objdate = {
  startDate:req.body.startDate,
  endDate:endDateLocal.format()
}
// console.log(endDateLocal.format());
    const examid = req.params.id;
    const exam = await examModel.updateOne({_id:examid},{$set:objdate});
    if (!exam) {
      return res.status(404).send("There is no exam with id " + id);
    }
    return res.status(200).send(exam);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/", async (req, res) => {
  try {
    const exams = await examModel.deleteMany({});
    if (!exams) {
      return res.status(404).send("There is no exams yet");
    }
    return res.status(200).send(exams);
  } catch (err) {
    res.status(500).send(err);
  }
});
// get exam by courseid
router.get("/:id", async (req, res) => {
  try {
    const courseid = req.params.id;
    const exam = await examModel.findOne({courseId:courseid});
    if (!exam) {
      return res.status(404).send("There is no exam with id " + id);
    }
    return res.status(200).send(exam);
  } catch (err) {
    res.status(500).send(err);
  }
});

// put exam by courseid
router.put("/:id",async (req, res) => {
  try {
    const courseid = req.params.id;
    const exam = await examModel.updateOne({courseId:courseid},{$set:req.body});
    if (!exam) {
      return res.status(404).send("There is no exam with id " + id);
    }
    return res.status(200).send(exam);
  } catch (err) {
    res.status(500).send(err);
  }
});

// create exam
router.post("/",async (req, res) => {
  try {
    if (
      !(
        req.body.courseId ||
        req.body.type ||
        req.body.name ||
        req.body.questions
      )
    ) {
      return res.status(400).send("All inputs is required");
    }
    const exam = new examModel({
      courseId: req.body.courseId,
      name: req.body.name,
      type: req.body.type,
      questions: req.body.questions,
    });

    const saved = await exam.save();
    // console.log(saved);
    res.status(201).send(saved);
  } catch (error) {
    res.status(400).send(error);
  }
});

// get all exams

router.get("/", async (req, res) => {
  try {
    const exams = await examModel.find({});
    if (!exams) {
      return res.status(404).send("There is no exams yet");
    }
    return res.status(200).send(exams);
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router;
