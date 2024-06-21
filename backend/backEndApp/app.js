const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const sellerUserRoute = require("./routes/seller-user");
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

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, PATCH, PUT, POST, DELETE, OPTIONS"
//   );
//   next();
// });

app.use("/api/user", sellerUserRoute);

// ---Error Handling Middleware in Express-Validation---
app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    console.log("Validation Error:=>", err);

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
