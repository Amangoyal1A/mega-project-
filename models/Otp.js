const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expire: 5 * 60,
  },
});

async function sendVerificationMail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from Study Notion for otp",
      otp
    );
    console.log("Email send successfully", mailResponse);
  } catch (error) {
    console.log("error while send verification mail", error);
  }
}
otpSchema.pre("save", async function (next) {
  await sendVerificationMail(this.email, this.otp);
  next();
});
module.exports = mongoose.model("Otp", otpSchema);
