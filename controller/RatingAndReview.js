const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

async function CreateRating(req, res) {
  try {
    //get userid
    const userId = req.user.id;

    //fetch request
    const { rating, review, courseId } = req.body;

    const userAlreadyEnrolled = await Course.findOne({
      _id: courseId,
      studentEnrolled: {
        $elemMatch: { $eq: userId },
      },
    });

    if (!userAlreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "User not enrolled",
      });
    }

    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "User not allowed for second time",
      });
    }

    const ratingAndReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReview: ratingAndReview._id,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in rating and review",
      err: error.message,
    });
  }
}

async function getAverageRating(req, res) {
  try {
    const courseId = req.body.courseId;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseId",
      });
    }

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    console.log("average rating", result);
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Average rating",
        data: result[0].averageRating,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No ratings found for the given courseId",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in rating and review",
      err: error.message,
    });
  }
}

async function getAllReviews(req, res) {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: -1 })
      .populate("User", "firstName lastName email image")
      .populate("Course", "courseName")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All review fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Error while fetching reviews",
      err: error,
    });
  }
}
