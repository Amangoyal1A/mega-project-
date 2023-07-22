const express = require("express");
const courseRouter = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controller/Course");

const {
  createSection,
  updateSection,
  getAllSections,
  deleteSection,
} = require("../controller/Section");

const {auth,isInstructor} = require("../middleware/authMiddleware")
const {createSubSection} = require("../controller/SubSection")


courseRouter.post("/createCourse", auth, isInstructor, createCourse);

courseRouter.post("/addSection", auth, isInstructor, createSection);
// Update a Section
courseRouter.post("/updateSection", auth, isInstructor, updateSection);
courseRouter.post("/deleteSection", auth, isInstructor, deleteSection);
// courseRouter.post("/updateSubSection", auth, isInstructor, updateSubSection);
// courseRouter.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

courseRouter.post("/addSubSection", auth, isInstructor, createSubSection);

courseRouter.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Courses
courseRouter.get("/getCourseDetails", getCourseDetails);

module.exports ={
    courseRouter
}
