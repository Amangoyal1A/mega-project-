const User = require("../models/User");
const OtpModel = require("../models/Otp");
const otpGenerator = require("otp-generator");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const JWT = require("jsonwebtoken");
require("dotenv").config();
const cookie = require("cookie");

//send otp
async function sendOtp(req, res) {
  try {
    //fetch email
    const { email } = req.body;

    //check user already exists or not

    const user = User.findOne({ email });

    if (user) {
      res.status(400).json({
        sucess: false,
        message: "user already exists",
      });
    }
    //generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log(otp);

    let result = OtpModel.findOne({ otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OtpModel.findOne({ otp });
    }

    let otpPayload = { email, otp };

    const otpBody = OtpModel.create(otpPayload);

    res.status(200).json({
      success: true,
      message: "Otp sent Successfully",
      otp,
    });
  } catch (error) {
    console.log("Error while generating otp", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// const User = require("../models/User");
// const OtpModel = require("../models/Otp");

// Send OTP
// async function sendOtp(req, res) {
//   try {
//     const { email } = req.body;

//     // Check if user already exists
//     const user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     const otp = generateUniqueOtp();

//     const payload = { email, otp };
//     const otpBody = await OtpModel.create(payload);

//     return res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//       otp,
//     });
//   } catch (error) {
//     console.log("Error while generating OTP", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

// // Generate unique OTP
// function generateUniqueOtp() {
//   let otp = generateOtp();

//   // Check if generated OTP already exists in the database
//   return OtpModel.findOne({ otp })
//     .then((result) => {
//       if (result) {
//         // If OTP already exists, generate a new one
//         otp = generateUniqueOtp();
//       }
//       return otp;
//     })
//     .catch((error) => {
//       console.log("Error while checking OTP uniqueness", error);
//       throw error;
//     });
// }

// // Generate OTP
// function generateOtp() {
//   return shortid.generate();
// }

//sign up

async function signup(req, res) {
  //data fetch from request body

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate krlo
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !contactNumber ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }
    //2 password match

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword not matching",
      });
    }

    //check user already exists or not

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exits",
      });
    }

    //find most recent otp
    const recentOtp = OtpModel.find({ email }).sort({ createdAt: -1 }).limit(1);
    //validate otp
    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Otp not found",
      });
    } else if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid otp",
      });
    }
    //password hash

    const hasedPassword = await bcrypt.hash(password, 10);

    //entry create in db

    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const users = await User.create({
      firstName,
      lastName,
      email,
      password: hasedPassword,
      accountType,
      additionalDeatils: profile._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //response

    return res.status(200).json({
      success: true,
      message: "Signup Successfully",
      user,
    });
  } catch (error) {
    console.log("Error while Signup", error);
    return res.status(500).json({
      success: false,
      message: "User Cannot Register please try again later",
    });
  }
}

//login

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields required",
      });
    }

    const user = User.findOne({ email }).populate("additionalDeatils");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not Registred,please signup",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      const token = JWT.sign(payload, process.env.JWT_TOKEN, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      res
        .cookie(
          "token",
          token,
          (Options = {
            expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            http: true,
          })
        )
        .status(200)
        .json({
          sucess: true,
          user,
          token,
          message: "login successfully",
        });
    } else {
      return res.status(500).json({
        success: false,
        message: "Password Incorrect",
        err: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while login",
      err: error.message,
    });
  }
}

//changePassword


async function changePassword(){
   
}