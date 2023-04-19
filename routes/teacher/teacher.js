const express = require("express");
const router = express.Router();
require("dotenv").config();
//model
const courseModel = require("../../models/teacher/course");
const examModel = require("../../models/teacher/exam");
const resultModel = require("../../models/student/result");
const attendanceModel = require("../../models/student/attendance");
const noteModel = require("../../models/student/notes");
const student = require("../../middlewares/student/student");
const teacherModel = require("../../models/user");
const fs = require("fs");
//all result for teacher's course
router.get('/result/:teacherId',async(req,res)=>{
  try {
      const  result =await resultModel.find({teacherId:req.params.teacherId})
      .populate([
        {
          path: "courseId",
          model: "Course",
          select: { name: 1},
        },
        {
          path: "studentId",
          model: "user",
          select: { firstName: 1, lastName: 1 },
        },
      ]).sort({ courseId: 1 });
     return res.json(result);
  } catch(err){
      console.log(err);
      res.status(500).send(err);
  }
 })

//correct 
 router.get('/correct/:teacherId',async(req,res)=>{
  try {
      const  result =await resultModel.find({teacherId:req.params.teacherId,isClassic:true})
      .populate([
        {
          path: "courseId",
          model: "Course",
          select: { name: 1},
        },
        {
          path: "studentId",
          model: "user",
          select: { firstName: 1, lastName: 1 },
        },
      ]).sort({ courseId: 1 });
     return res.json(result);
  } catch(err){
      console.log(err);
      res.status(500).send(err);
  }
 })
router.get("/", async (req, res) => {
    try {
      const teacherId = req.params.teacherId;
      const teacher = await teacherModel.find({role:"teacher"});
      return res.send(teacher);
    } catch (e) {
      return res.send(e);
    }
  });
  
  module.exports = router;