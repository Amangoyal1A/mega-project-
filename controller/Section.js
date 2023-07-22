const Section = require("../models/Section");
const Subsection = require("../models/SubSection");
const Course = require("../models/Course");

async function createSection(req, res) {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "all fields required",
      });
    }

    const createSection = await Section.create({ sectionName });

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      {
        _id:courseId,
      },
      {
        $push: {
          courseContent: createSection._id,
        },
      },
      { new: true }
    ).populate({
        path:"courseContent",
        populate:{
            path:"subSection"
        }
    });

    return res.status(200).json({
      sucess: true,
      Course: updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Error while creating course",
      error: error.message,
    });
  }
}

async function updateSection(req, res) {
  try {
    const { sectionName, sectionId } = req.body;
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "all fields required",
      });
    }

    const UpdatedSection = await Section.findByIdAndUpdate(
      { sectionId },
      { sectionName },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Section Updated Successfully",
      updatedSection: UpdatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while Updated Section",
      updatedSection: UpdatedSection,
    });
  }
}

async function getAllSections(req, res) {
  try {
    const Sections = await Section.find(
      {},
      {
        sectionName: true,
      }
    );

    return res.status(200).json({
      success: true,
      Section: Sections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: error.message,
    });
  }
}

async function deleteSection(req, res) {
  try {
    const { sectionId } = req.params;

    const deleteSection = await Section.findByIdAndDelete({ sectionId });

    return res.status(200).json({
      success: true,
      Section: "Section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: error.message,
    });
  }
}


module.exports ={
  createSection,updateSection,getAllSections,deleteSection
}