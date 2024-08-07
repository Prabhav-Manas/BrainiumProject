const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const app = express();

const sellerUserRoute = require("./routes/seller-user");
const productRoute = require("./routes/product");
const categoryRoute = require("./routes/category");
const cartRoute = require("./routes/cart");
const checkoutRoute = require("./routes/checkout");

const multer = require("multer");
const path = require("path");

const { ValidationError } = require("express-validation");

require("dotenv").config();

// ---CORS configuration---
const corsOptions = {
  origin: "http://localhost:4200", // Your frontend origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoDBURL = process.env.MONGODB_URL;

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Connected To Database");
  })
  .catch((error) => {
    console.error("Connection Failed!", error);
  });

// ---Serve Static Files for Uploaded Images---
app.use("/images", express.static(path.join("backEndApp/images")));

// ---Error Handling Middleware for Image Upload---
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.log("Multer Error:", err.message);
    return res
      .status(400)
      .json({ message: "File upload error", error: err.message });
  } else if (err.message === "Invalid MIME Type") {
    console.log("Invalid MIME Type:", err.message);
    return res
      .status(400)
      .json({ message: "Invalid file type", error: err.message });
  } else {
    console.log("Internal Error:", err.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

app.use("/api/user", sellerUserRoute);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);

// ---Error Handling Middleware in Express-Validation---
app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    const errorMessages = err.details.body
      .map((error) => error.message)
      .join(", ");
    return res.status(err.statusCode).json({
      message: "Validation Failed",
      errors: errorMessages,
    });
  }

  console.log("Internal Error:=>", err);

  return res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

module.exports = app;
