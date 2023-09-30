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

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
userRouter.post("/login", login);

// Route for user signup
userRouter.post("/signup", signup);

// Route for sending OTP to the user's email
userRouter.post("/sendotp", sendOtp);

// Route for Changing the password
userRouter.post("/changepassword", auth, changePassword);

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
userRouter.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
userRouter.post("/reset-password", resetPassword);

module.exports = { userRouter };
