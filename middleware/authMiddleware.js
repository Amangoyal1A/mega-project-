const JWT = require("jwt");
require("dotenv").config();
const userModel = require("../models/User");

//auth
async function auth(req, res, next) {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({
        sucess: false,
        message: "token is missing",
      });
    }

    try {
      const decode = await JWT.verify(token, process.env.JWT_TOKEN);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        sucess: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: "Something went wrong while validating the token",
    });
  }
}

//isStudent

async function isStudent(req, res, next) {
  const { accountType } = req.user;
  try {
    if (accountType !== "Student") {
      return res.status(400).json({
        sucess: false,
        message: "this is protected route of student only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "error in isStudent",
      err: error.message,
    });
  }
}

//isAdmin

async function isAdmin(req, res, next) {
  const { accountType } = req.user;
  try {
    if (accountType !== "Admin") {
      return res.status(400).json({
        sucess: false,
        message: "this is protected route of Admin only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "error in isAdmin",
      err: error.message,
    });
  }
}

//isInstructor
async function isInstructor(req, res, next) {
  const { accountType } = req.user;
  try {
    if (accountType !== "Instructor") {
      return res.status(400).json({
        sucess: false,
        message: "this is protected route of Instructor only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "error in isInstructor",
      err: error.message,
    });
  }
}
