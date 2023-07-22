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

module.exports = {
  createCategory,
  showAllCategory,
};
