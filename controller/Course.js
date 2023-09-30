const User = require("../models/User");
const Tags = require("../models/Category");
const Course = require("../models/Course");
const dotenv = require("dotenv");

dotenv.config();

const uploadImageToCloudinary = require("../utils/cloudinary");
const Category = require("../models/Category");

async function createCourse(req, res) {
  try {
    //get data
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      categoryId,
      status
    } = req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation check
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are reqired",
      });
    }

    //from middleware
    const InstructorId = req.user.id;

    const InstructorDetails = await User.findById({ _id: InstructorId });

    if (!InstructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructior not Found",
      });
    }

    //tag validation

    const categoryDeatils = await Category.findById({ _id: categoryId });

    if (!categoryDeatils) {
      return res.status(400).json({
        success: false,
        message: "Category not Found",
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
      category: categoryDeatils._id,
      thumbnail: thumbnailImage.secure_url,
      tag: tag,
    });

    await User.findByIdAndUpdate(
      { _id: InstructorDetails._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );

    await Category.findByIdAndUpdate(
      { _id: categoryId },
      {
        $push: {
          course: newCourse._id,
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

async function getCourseDetails(req, res) {
  try {
    const { courseId } = req.body;

    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDeatils",
        },
      })
      .populate("category")
      // .populate("RatingAndReview")
      .populate({ path: "courseContent", populate: { path: "subSection" } });


    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Couldn't find the course",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't find the course",
      err: error.message,
    });
  }
}
module.exports = {
  createCourse,
  getAllCourses,
  getCourseDetails,
};
