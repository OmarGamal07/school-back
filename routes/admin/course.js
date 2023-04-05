const express = require("express");
const router = express.Router();
require("dotenv").config();
//model
const courseModel = require("../../models/teacher/course");
const examModel = require("../../models/teacher/exam");
const resultModel = require("../../models/student/result");
const attendanceModel = require("../../models/student/attendance");

const admin = require("../../middlewares/admin/admin");
const teacher = require("../../middlewares/teacher/teacher");
const fs = require("fs");
const { findById } = require("../../models/teacher/course");
router.post("/", [admin], async (req, res) => {
  try {
    if (!req.body.name || !req.body.Date) {
      return res
        .status(400)
        .json({ message: "Name and Date are required fields" });
    }

    const date = new Date(req.body.Date);
    //check data > data now
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    // if (!Array.isArray(req.body.courseProgram)) {
    //     return res.status(400).json({ message: 'courseProgram must be an array of ObjectId values' });
    //   }
    const objCourse = {
      name: req.body.name,
      description: req.body.description,
      Date: req.body.Date,
      courseProgram: req.body.courseProgram,
    };
    const course = await courseModel.create(objCourse);
    return res.json(course);
  } catch (error) {
    return res.send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const course = await courseModel.find({});
    return res.json(course);
  } catch (err) {
    res.status(500).send(err);
  }
}); //get

//get one course by id and display his lessons and notes
router.get("/:id", async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await courseModel
      .findById(courseId)
      .populate({
        path: "courseProgram",
        model: "courseProgram",
        select: { name: 1, description: 1 },
      })
      .populate({
        path: "notes.studentId",
        select: "name",
      });

    if (!course) {
      return res.status(404).send("Course not found");
    }

    return res.json(course);
  } catch (err) {
    res.status(500).send(err);
  }
});

//delete all courses

router.delete("/", [admin], async (req, res) => {
  try {
    await Promise.all([
      examModel.deleteMany({}),
      resultModel.deleteMany({}),
      attendanceModel.deleteMany({}),
    ]);
    const courses = await courseModel.deleteMany({});
    return res.json(courses);
  } catch (err) {
    res.status(500).send(err);
  }
}); //delete all courses

router.delete("/:id", [admin], async (req, res) => {
  try {
    const courseId = req.params.id;

    await Promise.all([
      examModel.deleteMany({ courseId }),
      resultModel.deleteMany({ courseId }),
      attendanceModel.deleteMany({ courseId }),
    ]);

    const course = await courseModel.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).send("Course not found");
    }

    return res.json(course);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", [admin], async (req, res) => {
  const id = req.params.id;
  const objCourse = {
    name: req.body.name,
    description: req.body.description,
    Date: req.body.Date,
  };
  try {
    const course = await courseModel.updateOne(
      { _id: id },
      { $set: objCourse }
    );
    if (!course) {
      return res.status(404).send("Course not found");
    }
    return res.json(course);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
