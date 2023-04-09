const express = require("express");
const router = express.Router();
require("dotenv").config();
//model
const courseModel = require("../../models/teacher/course");
const examModel = require("../../models/teacher/exam");
const student = require("../../middlewares/student/student");
const teacherModel = require("../../models/user");
const fs = require("fs");

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

// get exam by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const exam = await examModel.findById(id);
    if (!exam) {
      return res.status(404).send("There is no exam with id " + id);
    }
    return res.status(200).send(exam);
  } catch (err) {
    res.status(500).send(err);
  }
});

// create exam
router.post("/", async (req, res) => {
  try {
    if (
      !(
        req.body.courseId ||
        req.body.startDate ||
        req.body.endDate ||
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
      startDate: req.body.startDate,
      endDate: req.body.endDate,
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

module.exports = router;
