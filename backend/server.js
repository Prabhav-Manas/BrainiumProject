const http = require("http");
const app = require("./backEndApp/app");
require("dotenv").config();

const port = process.env.PORT || 8080;
app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
