const Tag = require("../models/Tags");

async function createTags(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const tags = await Tag.create({
      name: name,
      description: description,
    });

    return res.status(200).json({
      sucess: true,
      message: "Tag create successfully",
    });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Error in creating tags",
      err: error.message,
    });
  }
}

async function showAllTags(res, res) {
  try {
    const alltags = await Tag.find({}, { name: true, description: true });

    res.status(200).json({
      success: true,
      message: "All tags",
      tags: alltags,
    });
  } catch (error) {
    return res.status(500).json({
        sucess: false,
        message: "Error in fetching tags",
        err: error.message,
      });
  }
}
