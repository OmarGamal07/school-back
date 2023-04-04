const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const courseProgramModel = require("../../models/admin/courseProgram");
const admin = require("../../middlewares/admin/admin");
const upload = require("../../middlewares/upload");
const fs = require("fs");
const { exit } = require("process");
require("dotenv").config();
const imgURL = process.env.imgUrl;
// display all Course Programs---------------------

router.get("/", async (req, res) => {
  try {
    const courseProgram = await courseProgramModel.find({});
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
    res.send(courseProgram);
  } catch (e) {
    res.send(e);
  }
});

// add courseProgram -----------------------

router.post(
  "/",
  [admin, upload("courseprogram").single("image")],
  async (req, res) => {
    if (!(req.body.name && req.body.description)) {
      res.status(400).send("All inputs is required");
    }
    const courseProgram = new courseProgramModel({
      name: req.body.name,
      description: req.body.description,
      image: req.file.filename,
    });
    try {
      await courseProgram.save();
      res.send(courseProgram);
    } catch (e) {
      res.send(e);
    }
  }
);

// update courseProgram-----------------------

router.patch(
  "/:id",
  [admin, upload("courseprogram").single("image")],
  async (req, res) => {
    const id = req.params.id;
    try {
      const courseProgram = await courseProgramModel.findById(id);
      if (!courseProgram) {
        res.status(404).send("courseProgram not found");
        console.log(res.statusCode);
      } else {
        if (req.file && res.statusCode != 404) {
          const imagePath = path.join(
            __dirname,
            "../../assets/uploads/courseprogram",
            courseProgram.image
          );
          fs.unlinkSync(imagePath);
          courseProgram.image = req.file.filename;
        }
        courseProgram.name = req.body.name;
        courseProgram.description = req.body.description;
        await courseProgram.save();
        res.send(courseProgram);
      }
    } catch (e) {
      res.send(e);
    }
  }
);

// delete courseProgram-----------------------

router.delete("/:id", admin, async (req, res) => {
  const id = req.params.id;
  try {
    const courseProgram = await courseProgramModel.findById({ _id: id });
    if (!courseProgram) {
      res.status(404).send("courseProgram not found");
    }
    if (req.file) {
      const imagePath = path.join(
        __dirname,
        "../../assets/uploads/courseprogram",
        courseProgram.image
      );
      fs.unlinkSync(imagePath);
    }
    const deletedcourseProgram = await courseProgramModel.findByIdAndDelete(id);
    res.send(deletedcourseProgram);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
