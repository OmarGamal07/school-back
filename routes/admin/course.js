const express = require("express");
const router = express.Router();
require("dotenv").config();
//model
const courseModel = require("../../models/teacher/course");
const examModel = require("../../models/teacher/exam");
const resultModel = require("../../models/student/result");
const attendanceModel = require("../../models/student/attendance");
const courseProgramModel = require("../../models/admin/courseProgram");
const noteModel = require("../../models/student/notes");
const admin = require("../../middlewares/admin/admin");
const teacher = require("../../middlewares/teacher/teacher");
const fs = require("fs");
const { findById } = require("../../models/teacher/course");
const upload = require("../../middlewares/upload");
const path = require("path");


router.post("/", [admin,upload('Course').single('image')], async (req, res) => {
  try {
    // || !req.body.teacherId
    // console.log(req.body);
    if (!req.body.name || !req.body.Date) {
      return res
        .status(400)
        .json({ message: "Name , Date and Image are required fields" });
    }
      const date = new Date(req.body.Date);
      if (isNaN(date.getTime()) || date.getTime() < Date.now()) {
        return res
          .status(400)
          .json({ message: "Invalid date format or date is in the past" });
      }
      // if (!Array.isArray(req.body.courseProgram)) {
      //     return res.status(400).json({ message: 'courseProgram must be an array of ObjectId values' });
      //   }
      const objCourse = {
        name: req.body.name,
        description: req.body.description,
        Date: req.body.Date,
        courseProgram: req.body.courseProgram,
        image: req.file.filename,
        teacherId: req.body.teacherId,
      };
      const course = await courseModel.create(objCourse);
      return res.json(course);
    } catch (error) {
      return res.send(error);
    }
    // if (!Array.isArray(req.body.courseProgram)) {
    //     return res.status(400).json({ message: 'courseProgram must be an array of ObjectId values' });
    //   }
  });
//get teacher's course
router.get("/teacher/:teacherid", async (req, res) => {
  try {
    const course = await courseModel
      .find({ teacherId: req.params.teacherid })
      .populate([
        {
          path: "courseProgram",
          model: "courseProgram",
          select: { name: 1, description: 1 },
        },
      ]);

    if (!course) {
      return res.status(404).send("Course not found");
    }

    return res.json(course);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//get student's course
router.get("/student/:studentid", async (req, res) => {
  try {
    const studentId = req.params.studentid;
    const course = await courseModel
      .find({ studentId: { $in: [studentId] } })
      .populate([
        {
          path: "courseProgram",
          model: "courseProgram",
          select: { name: 1, description: 1 },
        },
        {
          path: "teacherId",
          model: "user",
          select: { firstName: 1, lastName: 1 },
        },
      ]);

    if (!course) {
      return res.status(404).send("Course not found");
    }

    return res.json(course);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const course = await courseModel.find(
      {},
      { name: 1, description: 1, Date: 1 , image: 1}
    );
    return res.json(course);
  } catch (err) {
    res.status(500).send(err);
  }
}); //get

//get one course by id and display his lessons
router.get("/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await courseModel.findById(courseId).populate([
      {
        path: "courseProgram",
        model: "courseProgram",
        select: { name: 1, description: 1 },
      },
      {
        path: "teacherId",
        model: "user",
        select: { firstName: 1, lastName: 1 },
      },
      {
        path: "studentId",
        model: "user",
        select: { firstName: 1, lastName: 1 },
      },
      {
        path: "notes", // Update the path to "notes"
        model: "note", // Update the model to "noteModel"
        select: { _id: 1, noteData: 1 }, // Specify the fields to select
      },
    ]);
    if (!course) {
      return res.status(404).send("Course not found");
    }
    // const newnotes = await noteModel.find({ courseId: courseId }, { _id: 1,note:1 }); // Update to select only _id field

    // // Update the notes field in course object with newnotes array
    // course.notes = newnotes.map(note => ({ noteId: note._id,noteData:note.note }));

    await course.save();
    return res.json(course);
  } catch (err) {
    console.log(err);
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
      courseProgramModel.deleteMany({}),
      noteModel.deleteMany({}),
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
      courseProgramModel.deleteMany({ courseId }),
      noteModel.deleteMany({ courseId }),
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

router.put(
  "/:id",
  [admin, upload("course").single("image")],
  async (req, res) => {
    const id = req.params.id;
    if (!req.body.name || !req.body.Date) {
      return res
        .status(400)
        .json({ message: "Name and Date are required fields" });
    }

    const date = new Date(req.body.Date);
    if (isNaN(date.getTime()) || date.getTime() < Date.now()) {
      return res
        .status(400)
        .json({ message: "Invalid date format or date is in the past" });
    }
    const objCourse = {
      name: req.body.name,
      description: req.body.description,
      Date: req.body.Date,
    };
    if (req.file && res.statusCode != 404) {
      const imagePath = path.join(
        __dirname,
        "../../assets/uploads/course",
        objCourse.image
      );
      fs.unlinkSync(imagePath);
      objCourse.image = req.file.filename;
    }
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
  }
);

module.exports = router;
