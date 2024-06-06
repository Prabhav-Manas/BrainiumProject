const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const sellerUserRoute = require("./routes/seller-user");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const mongoDBURL =
  "mongodb+srv://Manas:AGjhA1TmVr8q51mG@brainiumcluster.iuqydsw.mongodb.net/brainiumInternProject?retryWrites=true&w=majority&appName=BrainiumCluster";

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Connected To Database");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PATCH, PUT, POST, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/user", sellerUserRoute);

module.exports = app;
