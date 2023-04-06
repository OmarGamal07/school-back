const express = require('express');
const router = express.Router();
require('dotenv').config();
//model
const courseModel = require('../../models/teacher/course');
const student = require("../../middlewares/student/student");
const studentModel = require('../../models/student/notes');
const { route } = require('./attendence');
router.post('/', async (req, res) => {
    try {
      const { note, courseId, studentId } = req.body;
  
      // Validate input
      if (!note || !courseId || !studentId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Check if course and student exist
      const course = await courseModel.findById(courseId);
      const student = await studentModel.findById(studentId);
      if (!course || !student) {
        return res.status(404).json({ message: 'Course or student not found' });
      }
  
      // Create new note
      const newNote = await noteModel.create({
        note,
        courseId,
        studentId,
      });
      await courseModel.updateOne(
        { _id: courseId},
        { $push: { notes: newNote._id } }
      );
      // Return new note
      res.json(newNote);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
//   router.delete('/',async(req,res)=>{
//     try{
//         const id = req.params.id;
//         const result = await courseModel.updateMany(
//         {},
//         { $set: { notes:[] } });
//        await noteModel.delete({});
//         return res.json("deleted");
//   }
//   catch(err){
//     console.log(err);
//      res.status(500).send(err);
//   }
//  });
//   router.delete('/:id',async(req,res)=>{
//     try{
//         const id = req.params.id;
//         const result = await courseModel.updateMany(
//         { notes: { $in: id } },
//         { $pull: { courseProgram: { $in: id } } });
//        await noteModel.delete({_id:id});
//         return res.json("deleted");
//   }
//   catch(err){
//     console.log(err);
//      res.status(500).send(err);
//   }
//  });
 
// router.get('/',async(req,res)=>{
//  try {
//     const notes = await NoteModel.find({})
//     .populate('courseId')
//     .exec();
//     return res.json(notes);
//  } catch(err){
//      res.status(500).send(err);
//  }
// })
router.get(':courseId',async(req,res)=>{
    try {
       const notes = await NoteModel.find({courseId:req.params.courseId},{note:1,studentId:1})
        .populate("studentId");
       return res.json(notes);
    } catch(err){
        res.status(500).send(err);
    }
   })
  module.exports = router;