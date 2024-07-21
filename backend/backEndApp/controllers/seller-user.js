const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/seller-user");
const Category = require("../models/category");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../mailer");
const crypto = require("crypto");
const path = require("path");
const { error } = require("console");
const { ValidationError } = require("express-validation");
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
      phone: req.body.phone,
      userType: userType,
    };

    if (userType === "seller") {
      userData.businessName = req.body.businessName;
      userData.gstNumber = req.body.gstNumber;
      userData.category = req.body.categoryId;
    }

    // ---Generate a verification token---
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // ---Assign the verification token to the user---
    userData.verificationToken = verificationToken;
    const user = new User(userData);

    // Check if categoryId exists in the request body (adjust this based on how categoryId is provided)
    const categoryId = req.body.categoryId; // Assuming categoryId is provided in the request body

    // Validate the categoryId by querying the Category model
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          message: "Category not found!",
        });
      }
      // Assign category to user
      user.category = categoryId;
    }

    await user.save();

    // ---Construct verification link---
    const verificationLink = `http://localhost:8080/api/user/verify/${verificationToken}`;

    // ---Send verification email---
    await sendVerificationEmail(user.email, user.firstName, verificationLink);

    // ---Send response---
    res.status(201).json({
      status: 201,
      message: "Sign up Successful. Verification link sent to your email.",
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
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
        status: 400,
        message: "User not found",
        loaderStatus: "complete", // Indicate loading is complete
      });
    }

    // ---Compare the provided password with the stored hashed password---
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        message: "Invalid credentials",
        loaderStatus: "complete", // Indicate loading is complete
      });
    }

    // ---Prepare the payload for JWT---
    const payload = {
      user: {
        id: user._id,
        type: userType,
        role: user.userType,
        firstName: user.firstName,
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
            status: 401,
            message: "Jwt signing error",
            loaderStatus: "complete", // Indicate loading is complete
          });
        }
        res.status(200).json({
          status: 200,
          message: "Login Successful",
          token: token,
          expiresIn: 3600,
          // userId: user._id,
          // userType: user.userType,
          loaderStatus: "complete", // Indicate loading is complete
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      loaderStatus: "complete", // Indicate loading is complete
    });
  }
};

// ---Forgot Password API---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received forgot password request email:=>", email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found for email:=>", email);
      return res.status(401).json({
        status: 401,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpires = Date.now() + 300000; // 5 minutes validity

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    try {
      await user.save();
      console.log("Generated reset token for user:=>", user._id);

      await sendPasswordResetEmail(user._id, user.email, resetToken);
      console.log("Password reset email triggered for:=>", user.email);

      res.status(200).json({
        status: 200,
        message: "Password reset email sent",
        token: resetToken,
      });
    } catch (saveError) {
      if (saveError.name === "ValidationError") {
        console.log("Validation Error:=>", saveError.errors);
        res.status(400).json({
          status: 400,
          message: "Validation Error",
          errors: saveError.errors,
        });
      } else {
        console.log("Error saving user:=>", saveError);
        res.status(500).json({
          status: 500,
          error: saveError.message,
          details: saveError.errors,
        });
      }
    }
  } catch (error) {
    console.log("Error in forgot password process:=>", error);
    res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

// ---RESET Password API---
exports.resetPassword = async (req, res) => {
  try {
    const { userId, token, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        status: 400,
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      status: 200,
      message: "Password has been reset",
    });
    // res.sendFile(
    //   path.join(__dirname, "../../public/email-template", "reset-password.html")
    // );
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
