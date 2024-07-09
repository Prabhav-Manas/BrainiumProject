const http = require("http");
const app = require("./backEndApp/app");
const express = require("express");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 8080;
app.set("port", port);

const server = http.createServer(app);

app.use("/images", express.static(path.join(__dirname, "images")));
// app.use("/images", express.static("images"));
app.use(express.static(path.join(__dirname, "public")));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
