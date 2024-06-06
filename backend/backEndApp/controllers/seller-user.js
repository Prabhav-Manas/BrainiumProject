const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendVerificationEmail } = require("../mailer");
const crypto = require("crypto");
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
    }

    const user = new User(userData);

    // ---Generate a verification token---
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // ---Assign the verification token to the user---
    user.verificationToken = verificationToken;
    await user.save();

    // ---Construct verification link---
    const verificationLink = `http://localhost:8080/api/user/verify/${verificationToken}`;

    // ---Send verification email---
    await sendVerificationEmail(user.email, user.firstName, verificationLink);

    // ---Send response---
    res.status(201).send("User registered. Verification email sent.");
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
      return res.status(200).json({ message: "Email already verified." });
    }

    user.isVerified = true;
    user.verificationToken = "";
    await user.save();

    res.status(200).json({ message: "Email verification successful." });
    res.sendFile(
      path.join(__dirname, "public/email-template", "registration-success.html")
    );
  } catch (error) {
    res.status(400).json({
      message: "Invalid or expired token.",
      error: error.message,
    });
    res.sendFile(
      path.join(__dirname, "public/email-template", "registration-failure.html")
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
      { expiresIn: 3600 },
      (error, token) => {
        if (error) {
          res.status(401).json({
            message: "Auth Failed",
            error: error.message,
          });
        }
        res.status(200).json({
          token: token,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
