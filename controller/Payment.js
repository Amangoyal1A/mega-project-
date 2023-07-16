const { default: mongoose } = require("mongoose");
const razorpay = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");

async function capturePayment(req, res) {
  try {
    const courseId = req.body;
    const userId = req.user;

    if (!courseId || !userId) {
      return res.status(401).json({
        success: false,
        message: "CourseId and UserId not found",
      });
    }
    let course = "";

    course = Course.findById({ courseId });

    if (!course) {
      return res.status(401).json({
        success: false,
        message: "Course Not Found",
      });
    }

    //if user already pay for the course

    const uId = new mongoose.Schema.Types.ObjectId(userId);

    if (course.studentEnrolled.includes(uId)) {
      return res.status(200).json({
        success: false,
        message: "Student already paid",
      });
    }
    //order create
    const price = course.price;
    const currency = "INR";

    const options = {
      amount: price * 100,
      curreny: currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId,
        userId,
      },
    };

    try {
      const paymentResponse = razorpay.orders.create(options);
      console.log("PAYMENT", paymentResponse);

      return res.status(200).json({
        sucess: true,
        courseName: course.course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.orderId,
        currency: paymentResponse.curreny,
        amount: paymentResponse.amount,
      });
    } catch (error) {}
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
}

//verify signature and server

async function verifySignature(req, res) {
  const webhookSecret = "1234567";
  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", webhookSecret);

  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("payment is authorized");
    const { userId, courseId } = req.body.payload.payement.entity.notes;

    try {
      const enrollCourse = await Course.findByIdAndUpdate(
        { _id: courseId },
        {
          $push: {
            studentEnrolled: userId,
          },
        },
        { new: true }
      );

      if (!enrollCourse) {
        return res.json({
          sucess: true,
          message: "Course not found",
        });
      }

      console.log(enrollCourse);

      const enrollStudent = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $push: {
            coures: courseId,
          },
        },
        { new: true }
      );

      if (!enrollStudent) {
        return res.json({
          sucess: true,
          message: "Student not found",
        });
      }

      console.log(enrollStudent);

      const mailresponse = await mailSender(
        enrollStudent.email,
        "Congratulation from AG Techno",
        "Congratulation on onboard to our edtech platform"
      );
      console.log(mailresponse);

      return res.status(200).json({
        sucess: true,
        message: "signature verified course added",
      });
    } catch (error) {
      return res.status(500).json({
        sucess: false,
        message: "Error in signature verified",
        err: error.message,
      });
    }
  } else {
    return res.status(400).json({
      sucess: false,
      message: "Invalid request",
    });
  }
}
