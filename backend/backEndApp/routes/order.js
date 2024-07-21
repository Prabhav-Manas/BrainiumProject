const express = require(express);
const router = express.Router();
const orderController = require("../controllers/order");

router.post("/save-order", orderController.saveOrder);

module.exports = router;
