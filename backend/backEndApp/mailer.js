const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const hbs = require("nodemailer-express-handlebars");

const handleBarsOptions = {
  viewEngine: {
    partialsDir: path.resolve(__dirname, "./template/registration"),
    defaultLayout: false,
    extName: ".handlebars",
  },
  viewPath: path.resolve(__dirname, "./template/registration"),
  extName: ".handlebars",
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.use("compile", hbs(handleBarsOptions));

// ---Function to send verification email---
async function sendVerificationEmail(
  customerEmail,
  username,
  verificationLink
) {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: customerEmail, // list of receivers
      subject: "Email Verification", // Subject line
      template: "index",
      context: {
        title: "Verification Email",
        userName: username,
        url: verificationLink,
      },
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// ---Function for sending RESET Password Email---
async function sendPasswordResetEmail(userId, customerEmail, token) {
  try {
    const resetLink = `http://localhost:4200/reset-password/${userId}/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: "Reset Password",
      template: "resetPassword",
      context: {
        title: "Reset Password",
        url: resetLink,
      },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent: %s", info.messageId);
  } catch (error) {
    console.log("Error in sending password reset email:=>", error);
  }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
