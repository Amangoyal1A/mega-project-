const nodemailer = require("nodemailer");

async function mailSender(email, title, body) {
  try {
    let transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASS,
      },
    });

    let info = transport.sendMail({
      from: "Study Notion",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log(info);
    return info;
  } catch (error) {
    console.log("Error while sending mail", error);
  }
}

module.exports = mailSender