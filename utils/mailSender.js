require("dotenv").config(); 

const nodemailer = require("nodemailer");

async function mailSender(email, title, body) {
  try {
    let transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port:587,
      secure:false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transport.sendMail({
      from: "Study Notion",
      to: email, // No need for template string here
      subject: title, // No need for template string here
      html: body, // No need for template string here
    });

    console.log("infos",info);
    return info;
  } catch (error) {
    console.log("Error while sending mail", error);
  }
}

module.exports = mailSender;
