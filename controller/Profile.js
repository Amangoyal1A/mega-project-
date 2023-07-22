const User = require("../models/User");

const Profile = require("../models/Profile");

async function updateProfile(req, res) {
  try {
    const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;

    const Userid = req.user.id;

    if (!gender || !contactNumber || !Userid) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

console.log("line number 18",Userid)
    const user = await User.findById({_id:Userid });

    console.log("user",user)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const profileId = user.additionalDeatils;
    console.log("31",profileId.toString())
    const profileUpdatedDetails = await Profile.findById({ _id:profileId });

    profileUpdatedDetails.gender = gender;

    profileUpdatedDetails.dateOfBirth = dateOfBirth;
    profileUpdatedDetails.about = about;
    profileUpdatedDetails.contactNumber = contactNumber;

    await profileUpdatedDetails.save();

    return res.status(200).json({
      success: true,
      Message: "profile added successfully",
      profileUpdatedDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      Message: "Error while creating profile",
      err:error
    });
  }
}

const cron = require("node-cron");

async function DeleteProfile(req, res) {
  const id = req.user.id;

  try {
    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Schedule the deletion after 2-3 days
    const deletionDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days in milliseconds
    cron.schedule(deletionDate, async () => {
      await Course.updateMany(
        { studentEnrolled: id },
        { $pull: { studentEnrolled: id } }
      );
      await Profile.findByIdAndDelete(userDetails.additionalDetails);
      await User.findByIdAndDelete(id);
    });

    return res.json({
      success: true,
      message: "Profile deletion scheduled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while scheduling the profile deletion",
    });
  }
}




module.exports = {
  updateProfile,
  DeleteProfile,
};
