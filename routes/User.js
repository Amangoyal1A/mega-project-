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

// Authentication Routes
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/changepassword", auth, changePassword);
userRouter.post("/sendotp", sendOtp);


// Reset Password Routes
userRouter.post("/reset-password-token", resetPasswordToken);
userRouter.post("/reset-password", resetPassword);

module.exports = { userRouter };
