const express = require("express");

const uploadImageToCloudinary = require("../utils/cloudinary");
const { updateProfile, DeleteProfile } = require("../controller/Profile");
const { auth } = require("../middleware/authMiddleware");

const profileRouter = express.Router();

profileRouter.post("/upload", async (req, res) => {
  try {
    // Assuming the file is sent as "file" in the form-data body of the POST request
    const file = req.files.file;
    const folder = "aman goyal"; // Replace "your_folder_name" with the desired folder name in your Cloudinary account.

    const result = await uploadImageToCloudinary(file, folder);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error uploading image" });
  }
});

profileRouter.put("/updateprofile", auth, updateProfile);

module.exports = { profileRouter };
