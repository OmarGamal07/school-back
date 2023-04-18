const express = require("express");
const router = express.Router();
require("dotenv").config();
//model
const courseModel = require("../../models/teacher/course");
const examModel = require("../../models/teacher/exam");
const resultModel = require("../../models/student/result");
const attendanceModel = require("../../models/student/attendance");
const noteModel = require("../../models/student/notes");
const moment = require('moment');
const student = require("../../middlewares/student/student");
const fs = require("fs");

// /student/enroll/:courseId/:studentId
router.patch("/enroll/:courseId/:studentId", [student], async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    const enroll = await courseModel.updateOne(
      { _id: courseId },
      { $push: { studentId: studentId } }
    );
    await examModel.updateOne(
      { courseId: courseId },
      { $push: { studentId: studentId } }
    );
    return res.send(enroll);
  } catch (e) {
    return res.send(e);
  }
});
// /student/cancel/:courseId/:studentId
router.patch("/cancel/:courseId/:studentId", [student], async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    const enroll = await courseModel.updateOne(
      { _id: courseId },
      { $pull: { studentId: studentId } }
    );
    await examModel.updateOne(
      { courseId: courseId },
      { $pull: { studentId: studentId } }
    );
    return res.send(enroll);
  } catch (e) {
    return res.send(e);
  }
});


// router.get("/:studentId", [student], async (req, res) => {
//   try {
//     const studentId = req.params.studentId;
//     const student = await studentModel.findById(studentId);
//     return res.send(student);
//   } catch (e) {
//     return res.send(e);
//   }
// });

//student's exams
router.get("/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const exams = await examModel.find({ studentId: { $elemMatch: { $eq: studentId } } });
    // console.log(exams);
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
        date:datePortion,
        courseId:exams[i].courseId
    }
   }
    
    // console.log(resexam);
    return res.send(resexam);
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
});
module.exports = router;
