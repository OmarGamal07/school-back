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
const moment = require("moment");
const { log } = require("console");
router.get("/mangeExam", async (req, res) => {
  try {
    const exam = await examModel.find({
      $or: [
        { startDate: { $exists: false } }, // Fetch exams without start date
        { endDate: { $exists: false } }, // Fetch exams without end date
      ],
    });
    return res.status(200).send(exam);
  } catch (err) {
    res.status(500).send(err);
  }
});
// put exam by id
router.patch("/mangeExam/:id", async (req, res) => {
  try {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const objdate = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    };
    if (
      isNaN(startDate.getTime()) ||
      startDate.getTime() < Date.now() ||
      endDate.getTime() < startDate.getTime()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid date format or date is in the past" });
    }
    const examid = req.params.id;
    const exam = await examModel.updateOne({ _id: examid }, { $set: objdate });
    const examcourse = await examModel.findOne({ _id: examid });
    const course = await courseModel.find({ _id: examcourse.courseId });

    for (i = 0; i < course[0].studentId.length; i++) {
      await examModel.updateOne(
        { _id: examid },
        { $push: { studentId: course[0].studentId[i] } }
      );
    }
    //  (course.studentId).forEach(async(element) => {
    //    await examModel.updateOne(
    //     { _id: examid },
    //     { $push: { studentId: element } }
    //   );
    // });

    if (!exam) {
      return res.status(404).send("There is no exam with id " + id);
    }
    return res.status(200).send(exam);
  } catch (err) {
    console.log(err);
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
    console.log(err);
    res.status(500).send(err);
  }
});
// get exam by id
router.get("/:id", async (req, res) => {
  try {
    const examid = req.params.id;
    const exam = await examModel.findOne({ _id: examid });
    if (!exam) {
      return res.status(404).send("There is no exam with id " + id);
    }
    return res.status(200).send(exam.questions);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// put exam by courseid
router.put("/:id", async (req, res) => {
  try {
    const courseid = req.params.id;
    const exam = await examModel.updateOne(
      { courseId: courseid },
      { $set: req.body }
    );
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
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
