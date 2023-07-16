const User = require("../models/User");
const Tags = require("../models/Category");
const Course = require("../models/Course");

const uploadImageToCloudinary = require("../utils/cloudinary");

async function CreateCourse(req, res) {
  try {
    //get data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation check
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are reqired",
      });
    }

    //from middleware
    const InstructorId = req.user.id;

    const InstructorDetails = await User.findById({ InstructorId });

    if (!InstructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructior not Found",
      });
    }

    //tag validation

    const tagDeatils = await Tags.findById({ tag });

    if (!tagDeatils) {
      return res.status(400).json({
        success: false,
        message: "Tag not Found",
      });
    }

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create entry in db

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: InstructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tagDeatils._id,
      thumbnail: thumbnailImage.secure_url,
    });

    await User.findByIdAndUpdate(
      { _id: InstructorDetails._id },
      {
        $push: {
          coures: newCourse._id,
        },
      },
      { new: true }
    );

    await Tags.findByIdAndUpdate(
      { tag },
      {
        $push: {
          coures: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      course: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Error in creating Course",
      err: error.message,
    });
  }
}

async function getAllCourses(req, res) {
  try {
    const courses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReview: true,
        studentEnrolled: true,
      }
    )
      .populate("User")
      .exec();
    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: error.message,
    });
  }
}
