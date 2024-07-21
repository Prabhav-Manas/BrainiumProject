const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const WebhookController = require("../controllers/webhook");

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  WebhookController.handleWebhook
);

module.exports = router;
