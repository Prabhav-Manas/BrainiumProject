const http = require("http");
const app = require("./backEndApp/app");
const express = require("express");
const path = require("path");

const port = process.env.PORT || 8080;
app.set("port", port);

const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "public")));
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
