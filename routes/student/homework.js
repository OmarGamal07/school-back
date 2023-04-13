const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const homeworkModel = require("../../models/student/homework");
const auth = require("../../middlewares/auth");
const teacher = require("../../middlewares/teacher/teacher");
const student = require("../../middlewares/student/student");
const upload = require("../../middlewares/upload");
const courseModel = require("../../models/teacher/course");
const fs = require("fs");

// get all homeworks
router.get("/", [auth], async (req, res) => {
  try {
    const homeowrk = await homeworkModel
      .find({})
      .populate("studentId")
      .populate("courseId");
    res.send(homeowrk);
  } catch (err) {
    res.send(err);
  }
});

// get homeowrk by id
router.get("/:id", [auth], async (req, res) => {
  try {
    const id = req.params.id;
    const homeowrk = await homeworkModel
      .findById(id)
      .populate("studentId")
      .populate("courseId");
    res.send(homeowrk);
  } catch (err) {
    res.send(err);
  }
});

// get homeowrk by course id
router.get("/courseProgram/:id", [auth], async (req, res) => {
  try {
    const id = req.params.id;
    const homeowrk = await homeworkModel
      .find({ courseId: id })
      .populate("studentId")
      .populate("courseProgramId");
    res.send(homeowrk);
  } catch (err) {
    res.send(err);
  }
});

// get homeowrk for student
router.get("/student/:id", [auth], async (req, res) => {
  try {
    const id = req.params.id;
    const homeowrk = await homeworkModel
      .find({ studentId: id })
      .populate("studentId")
      .populate("courseId");
    res.send(homeowrk);
  } catch (err) {
    res.send(err);
  }
});

// add homeowrk
router.post(
  "/",
  [auth, upload("homework").single("file")],
  async (req, res) => {
    try {
      console.log(Date.now().toLocaleString());
      const homework = new homeworkModel({
        studentId: req.body.studentId,
        courseProgramId: req.body.courseProgramId,
        note: req.body.note,
        file: req.file.filename,
      });
      await homework.save();
      if (homework) {
        return res.send(homework);
      } else {
        if (req.file) {
          const filePath = path.join(
            __dirname,
            "../../assets/uploads/homework",
            homework.file
          );
          fs.unlinkSync(filePath);
        }
        return res.status(500);
      }
    } catch (err) {
      res.send(err);
    }
  }
);

// delete homework-----------------------

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    const homework = await homeworkModel.findById({ _id: id });
    if (!homework) {
      res.status(404).send("homework not found");
    }
    if (req.file) {
      const filePath = path.join(
        __dirname,
        "../../assets/uploads/homework",
        homework.file
      );
      fs.unlinkSync(filePath);
    }
    const deletedHomework = await homeworkModel.findByIdAndDelete(id);
    return res.send(deletedHomework);
  } catch (e) {
    return res.send(e);
  }
});

module.exports = router;
