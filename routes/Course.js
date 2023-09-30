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

const {
  createCategory,
  showAllCategory,
  categoryPageDetails,
} = require("../controller/Category");

const { auth, isInstructor, isAdmin } = require("../middleware/authMiddleware");
const { createSubSection } = require("../controller/SubSection");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
courseRouter.post("/createCourse", auth, isInstructor, createCourse);
//Add a Section to a Course
courseRouter.post("/addSection", auth, isInstructor, createSection);
// Update a Section
courseRouter.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
courseRouter.post("/deleteSection", auth, isInstructor, deleteSection);
// Edit Sub Section
// courseRouter.post("/updateSubSection", auth, isInstructor, updateSubSection)
// // Delete Sub Section
// courseRouter.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
courseRouter.post("/addSubSection", auth, isInstructor, createSubSection);
// Get all Registered Courses
courseRouter.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Courses
courseRouter.post("/getCourseDetails", getCourseDetails);
// Edit a Course
// courseRouter.post("/editCourse", auth, isInstructor,isDemo, editCourse)
// // Get all Courses of a Specific Instructor
// courseRouter.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// //Get full course details
// courseRouter.post("/getFullCourseDetails", auth, getFullCourseDetails)
// // Delete a Course
// courseRouter.delete("/deleteCourse",auth,isDemo, deleteCourse)
// // Search Courses
// courseRouter.post("/searchCourse", searchCourse);
// //mark lecture as complete
// courseRouter.post("/updateCourseProgress", auth, isStudent, markLectureAsComplete);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
courseRouter.post("/createCategory", auth, isAdmin, createCategory);
courseRouter.get("/showAllCategories", showAllCategory);
courseRouter.post("/getCategoryPageDetails", categoryPageDetails);
// courseRouter.post(
//   "/addCourseToCategory",
//   auth,
//   isInstructor,
//   addCourseToCategory
// );

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
// courseRouter.post("/createRating", auth, isStudent, isDemo, createRating);
// courseRouter.get("/getAverageRating", getAverageRating);
// courseRouter.get("/getReviews", getAllRating);

module.exports = { courseRouter };
