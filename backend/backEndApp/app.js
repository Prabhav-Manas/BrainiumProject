const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const sellerUserRoute = require("./routes/seller-user");
const productRoute = require("./routes/product");
const categoryRoute = require("./routes/category");
const cartRoute = require("./routes/cart");
const multer = require("multer");
const path = require("path");
const { ValidationError } = require("express-validation");

// CORS configuration
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
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "images")));

const mongoDBURL =
  "mongodb+srv://Manas:AGjhA1TmVr8q51mG@brainiumcluster.iuqydsw.mongodb.net/brainiumInternProject?retryWrites=true&w=majority&appName=BrainiumCluster";

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Connected To Database");
  })
  .catch((error) => {
    console.error("Connection Failed!", error);
  });

// ---For Image Upload---
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

// ---Handle Invalid URLs---
app.use("/api/*", (req, res) => {
  res.status(404).json({
    message: "Bad Request. Invalid URL",
  });
});

module.exports = app;
