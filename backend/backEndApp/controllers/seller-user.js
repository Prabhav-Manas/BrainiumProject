const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/seller-user");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../mailer");
const crypto = require("crypto");
const path = require("path");
require("dotenv").config();

// ---CreateSellerUser API---
exports.createSellerUser = async (req, res) => {
  try {
    // ---Hash password---
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const userType = req.body.userType;
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword,
      countryCode: req.body.countryCode,
      phone: req.body.phone,
      userType: userType,
    };

    if (userType === "seller") {
      userData.businessName = req.body.businessName;
      userData.gstNumber = req.body.gstNumber;
    } else {
      userData.businessName = "";
      userData.gstNumber = "";
    }

    // ---Generate a verification token---
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // ---Assign the verification token to the user---
    userData.verificationToken = verificationToken;
    const user = new User(userData);

    await user.save();

    // ---Construct verification link---
    const verificationLink = `http://localhost:8080/api/user/verify/${verificationToken}`;

    // ---Send verification email---
    await sendVerificationEmail(user.email, user.firstName, verificationLink);

    // ---Send response---
    res.status(201).json({
      message: "User registered. Verification email sent.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ---EmailVerification API---
exports.verificationEmail = async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(400).send({ message: "Please provide a token" });
  }
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send({
        message: "User not found. Already verified or token expired.",
      });
    }

    if (user.isVerified) {
      // res.status(200).json({ message: "Email already verified." });
      return res.sendFile(
        path.join(
          __dirname,
          "../../public/email-template",
          "registration-success.html"
        )
      );
    }

    user.isVerified = true;
    user.verificationToken = "";
    await user.save();

    // res.status(200).json({ message: "Email verification successful." });
    res.sendFile(
      path.join(
        __dirname,
        "../../public/email-template",
        "registration-success.html"
      )
    );
  } catch (error) {
    // res.status(400).json({
    //   message: "Invalid or expired token.",
    //   error: error.message,
    // });
    res.sendFile(
      path.join(
        __dirname,
        "../../public/email-template",
        "registration-failure.html"
      )
    );
  }
};

// ---LogInSellerUser API---
exports.logInSellerUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userType = req.body.userType;

    // ---Find the user in the database---
    const user = await User.findOne({ email, userType });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // ---Compare the provided password with the stored hashed password---
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // ---Prepare the payload for JWT---
    const payload = {
      user: {
        id: user.id,
        type: userType,
      },
    };

    // ---Sign & Generate the JWT Token---
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (error, token) => {
        if (error) {
          res.status(401).json({
            message: "Auth Failed",
            error: error.message,
          });
        }
        res.status(200).json({
          token: token,
          expiresIn: 3600,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---Forgot Password API---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpires = Date.now() + 300000; // 5 minutes validity

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ---RESET Password API---
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = "";

    await user.save();

    // res.status(200).json({
    //   message: "Password has been reset",
    // });
    res.sendFile(
      path.join(__dirname, "../../public/email-template", "reset-password.html")
    );
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
