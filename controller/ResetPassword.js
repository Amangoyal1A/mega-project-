const UserModel = require("../models/User");

const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPasswordToken

async function resetPasswordToken(req, res) {
  try {
    //get email from req.body

    const { email } = req.body;

    const user = UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    const token = crypto.randomUUID();

    const updatedDetails = await UserModel.findOneAndUpdate(
      { email },
      { token: token, resetPasswordExpired: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    const urlLink = `https://localhost:3000/update-password/${token}`;

    await mailSender(
      email,
      "Password reset Link",
      `password resetlink is here ${urlLink}`
    );

    return res.status(200).json({
      success: true,
      message: "mail sent",
      data: updatedDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Error occured while sending mail for resetpassword",
      err: error.message,
    });
  }
}

//resetPassword

async function resetPassword(req, res) {
  try {
    const { password, confirmPassword, token } = req.body;


    if(!password|| !confirmPassword||!token)
    {
      return res.status(401).json({
        success: false,
        message: "Required fields is not present",
      });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password not matching",
      });
    }

    const userDetails = UserModel.findOne({ token });

    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "token invalid",
      });
    }
    if (userDetails.resetPasswordExpired < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Link expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.findOneAndUpdate(
      {
        token: token,
      },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while reset password",
      err:error.message
    });
  }
}

module.exports = {
  resetPasswordToken,
  resetPassword,
};
