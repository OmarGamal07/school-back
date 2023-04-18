const express = require('express');
const router = express.Router();
require('dotenv').config();
//model
const courseModel = require('../../models/teacher/course');
const student = require("../../middlewares/student/student");
const teacher = require("../../middlewares/teacher/teacher");
const studentModel = require('../../models/user');
const examModel = require('../../models/teacher/exam')
const resultModel = require('../../models/student/result')
const noteModel = require('../../models/student/notes');
const { route } = require('./attendence');


router.post('/', async (req, res) => {
    try {
      const { examId, courseId,teacherId, studentId,result } = req.body;
  
      // Check if course and student exist
      const course = await courseModel.findById(courseId);
      const student = await studentModel.findById(studentId);
      const exam = await examModel.findById(examId);
      if (!course || !student || !exam) {
        return res.status(404).json({ message: 'Course or student or exam not found' });
      }
      let resultData;
      if(!req.body.isClassic || !req.body.studentAnswer){
      // Create new result
       resultData = await resultModel.create({
        examId:examId,
        courseId:courseId,
        studentId:studentId,
        teacherId:teacherId,
        result:result
      });
    }
    else{
       resultData = await resultModel.create({
        examId:examId,
        courseId:courseId,
        studentId:studentId,
        teacherId:teacherId,
        result:result,
        isClassic:req.body.isClassic,
        studentAnswer:req.body.studentAnswer
      });
    }
      res.json(resultData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

router.get('/',async(req,res)=>{
    try {
        const  result =await resultModel.find({})
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
   router.delete('/',async(req,res)=>{
    try {
        const  result =await resultModel.deleteMany({});
       return res.json(result);
    } catch(err){
        console.log(err);
        res.status(500).send(err);
    }
   })
 
  module.exports = router;