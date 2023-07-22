const express = require("express");
const userRouter = express.Router();

const {
  signup,
  login,
  changePassword,
  sendOtp,
} = require("../controller/Auth");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controller/ResetPassword");

const {
  auth,
  isStudent,
  isAdmin,
  isInstructor,
} = require("../middleware/authMiddleware");
const { createCategory, showAllCategory } = require("../controller/Category");

// Authentication Routes
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/changepassword", auth, changePassword);
userRouter.post("/sendotp", sendOtp);


// Reset Password Routes
userRouter.post("/reset-password-token", resetPasswordToken);
userRouter.post("/reset-password", resetPassword);

//admin routes
userRouter.post("/createcategory",auth,isAdmin,createCategory)
userRouter.get("/showallcategory",auth,isAdmin,showAllCategory)


module.exports = { userRouter };
