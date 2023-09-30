const Category = require("../models/Category");

async function createCategory(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const tags = await Category.create({
      name: name,
      description: description,
    });

    return res.status(200).json({
      sucess: true,
      message: "Category create successfully",
    });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Error in creating tags",
      err: error.message,
    });
  }
}

async function showAllCategory(res, res) {
  try {
    const allCategory = await Category.find(
      {},
      { name: true, description: true }
    );

    res.status(200).json({
      success: true,
      message: "All tags",
      Category: allCategory,
    });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Error in fetching tags",
      err: error.message,
    });
  }
}

async function categoryPageDetails(req, res) {
  try {
    const { categoryId } = req.body;

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId) //populate instuctor and rating and reviews from courses
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: [{ path: "instructor" }],
      })
      // .exec();


    console.log("line 65", selectedCategory);
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    }).populate({
      path: "course",
      match: { status: "Published" },
      populate: [{ path: "instructor" }],
    });
    let differentCourses = [];
    for (const category of categoriesExceptSelected) {
      differentCourses.push(...category.course);
    }

    // Get top-selling courses across all categories
    const allCategories = await Category.find().populate({
      path: "course",
      match: { status: "Published" },
      populate: [{ path: "instructor" }],
    });
    const allCourses = allCategories.flatMap((category) => category.course);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    res.status(200).json({
      selectedCategory,
      differentCourses,
      mostSellingCourses,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  createCategory,
  showAllCategory,
  categoryPageDetails,
};
