const SubSection = require("../models/SubSection");
const Section = require("../models/Section");

const uploadImageToCloudinary = require("../utils/cloudinary");

async function createSubSection(req, res) {
  try {
    const { sectionId, title, timeDuration, description } = req.body;

    const video = req.files.videoFile;

    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const videoUploaddetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const SubsectionDetails = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: videoUploaddetails.secure_url,
    });

    const SectionUpdated = await Section.findByIdAndUpdate(
      { _id:sectionId },
      {
        $push: {
          subSection: SubsectionDetails._id,
        },
      },
      {
        new: true,
      }
    ).populate("subSection");

    return res.status(200).json({
      success: true,
      Subsections: SubsectionDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating Subsection",
      error: error.message,
    });
  }
}


module.exports ={
  createSubSection
}