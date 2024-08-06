const jwt = require("jsonwebtoken");
const User = require("../models/seller-user");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Token:=>", token);

  if (!token) {
    return res.status(401).json({
      message: "Authentication Failed: No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:=>", decoded);
    const user = await User.findById(decoded.user.id).exec();
    console.log("User:=>", user);

    if (!user) {
      return res.status(401).json({
        message: "Authentication Failed: User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in finding token:=>", error.message);
    res.status(401).json({
      message: "Authentication Failed: Invalid Token",
    });
  }
};

module.exports = authenticateUser;
