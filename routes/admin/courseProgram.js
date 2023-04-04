const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const courseProgramModel = require("../../models/admin/courseProgram");
const admin = require("../../middlewares/admin/admin");

// display all Course Programs---------------------

router.get("/", admin, async (req, res) => {
  try {
    const courseProgram = await courseProgramModel.find({});
    res.send(courseProgram);
  } catch (err) {
    res.send(err);
  }
});

// display one lesson -------------

router.get("/:id", admin, async (req, res) => {
  const id = req.params.id;
  try {
    const courseProgram = await courseProgram.findById({ _id: id });
    res.send(courseProgram);
  } catch (e) {
    res.send(e);
  }
});

// add category -----------------------

router.post("/", admin, async (req, res) => {
  const courseProgram = new courseProgramModel({
    name: req.body.name,
    description: req.body.description,
    video: req.body.video,
  });
  try {
    await courseProgram.save();
    res.send(courseProgram);
  } catch (e) {
    res.send(e);
  }
});

// update category-----------------------

router.patch("/:id", admin, async (req, res) => {
  const id = req.params.id;
  try {
    const courseProgram = await courseProgramModel.findById(id);
    if (!courseProgram) {
      res.status(404).send("courseProgram not found");
    }
    courseProgram.name = req.body.name;
    courseProgram.description = req.body.description;
    courseProgram.video = req.body.video;
    await courseProgram.save();
    res.send(courseProgram);
  } catch (e) {
    res.send(e);
  }
});

// delete category and her books-----------------------

router.delete("/:id", admin, async (req, res) => {
  const id = req.params.id;
  try {
    const courseProgram = await courseProgramModel.findById({ _id: id });
    if (!courseProgram) {
      res.status(404).send("courseProgram not found");
    }
    const deletedcourseProgram = await courseProgramModel.findByIdAndDelete(id);
    res.send(deletedcourseProgram);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
