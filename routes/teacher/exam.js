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
const { log } = require("console");
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
    // const endDateISO = req.body.endDate; // Replace with the value received from front-end
    // const endDate = moment.utc(endDateISO); // Create a moment object in UTC time zone
    // const endDateLocal = endDate.local(); // Convert to local time zon
const objdate = {
  startDate:req.body.startDate,
  endDate:req.body.endDate
}
// console.log(req.body.startDate);
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
    console.log(err);
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
   let resexam=[];
   for(i=0;i<exams.length;i++){
    let start=null,end=null;
    let datePortion=null,starttimeString=null,endtimeString=null;
    if(exams[i].startDate){
    const startDateiso = moment.utc(exams[i].startDate); // Create a moment object in UTC time zone
    const startDateLocal = startDateiso.local(); // Convert to local time zon
     start=startDateLocal.format()
     const startdateParts = start.split("T"); // Split the string at "T" to separate the date and time
      starttimeString = startdateParts[1].substring(0, 5); // Extract the time portion from the resulting array
    
     const endDateiso = moment.utc(exams[0].endDate); // Create a moment object in UTC time zone
    const endDateLocal = endDateiso.local(); // Convert to local time zon
    end=endDateLocal.format()
    const enddateParts = end.split("T"); // Split the string at "T" to separate the date and time
 endtimeString = enddateParts[1].substring(0, 5); // Extract the time portion from the resulting array
 

      const dateTimeString = (exams[i].startDate).toISOString(); // The input date-time string
      datePortion = dateTimeString.split("T")[0]; // Extract the date portion
  }
  resexam[i]={
        _id:exams[i]._id,
        name:exams[i].name,
        startTime:starttimeString,
        endTime:endtimeString,
        date:datePortion
    }
   }
    
    console.log(resexam);
    return res.status(200).send(resexam);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});


module.exports = router;
