const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const courseProgramModel = require("../../models/admin/courseProgram");
const admin = require("../../middlewares/admin/admin");
const upload = require("../../middlewares/upload");
const fs = require("fs");
require("dotenv").config();
const courseModel = require("../../models/teacher/course");
const imgURL = process.env.imgUrl;
// display all Course Programs---------------------

router.get("/", async (req, res) => {
  try {
    const courseProgram = await courseProgramModel
      .find({})
      .populate("courseId");
    res.send(courseProgram);
  } catch (err) {
    res.send(err);
  }
});

// display one lesson -------------

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const courseProgram = await courseProgram.findById({ _id: id });
    return res.send(courseProgram);
  } catch (e) {
    return res.send(e);
  }
});

// add courseProgram -----------------------

router.post("/", [admin], async (req, res) => {
  if (!(req.body.name && req.body.description)) {
    res.status(400).send("All inputs are required");
  }
  const startDate = new Date(req.body.homework.startDate);
  const endDate = new Date(req.body.homework.endDate);
  if (
    isNaN(startDate.getTime()) ||
    startDate.getTime() < Date.now() ||
    endDate.getTime() < startDate.getTime()
  ) {
    return res
      .status(400)
      .json({ message: "Invalid date format or date is in the past" });
  }
  const courseProgram = new courseProgramModel({
    name: req.body.name,
    description: req.body.description,
    courseId: req.body.courseId,
    homework: {
      startDate,
      endDate,
      homeworkDescription: req.body.homework.homeworkDescription,
    },
  });
  try {
    await courseProgram.save();
    await courseModel.updateOne(
      { _id: courseProgram.courseId },
      { $push: { courseProgram: courseProgram._id } }
    );
    return res.json(courseProgram);
  } catch (e) {
    return res.send(e);
  }
});
// update courseProgram-----------------------

router.patch("/:id", [admin], async (req, res) => {
  const id = req.params.id;
  try {
    const courseProgram = await courseProgramModel.findById(id);
    if (!courseProgram) {
      res.status(404).send("courseProgram not found");
      console.log(res.statusCode);
    } else {
      courseProgram.name = req.body.name;
      courseProgram.description = req.body.description;
      courseProgram.courseId = req.body.courseId;
      courseProgram.homework = req.body.homework;
      await courseProgram.save();
      return res.send(courseProgram);
    }
  } catch (e) {
    return res.send(e);
  }
});

// delete courseProgram-----------------------

router.delete("/:id", admin, async (req, res) => {
  const id = req.params.id;
  try {
    const courseProgram = await courseProgramModel.findById({ _id: id });
    if (!courseProgram) {
      res.status(404).send("courseProgram not found");
    }
    const deletedcourseProgram = await courseProgramModel.findByIdAndDelete(id);
    return res.send(deletedcourseProgram);
  } catch (e) {
    return res.send(e);
  }
});

module.exports = router;
