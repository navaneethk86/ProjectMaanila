const express = require("express");
const router = express.Router();

const payment_update = require("../controllers/payment_update.js");

router.post("/payment_update", payment_update.payment_update);

router.post("/generate_bill", payment_update.generate_bill);

module.exports = router;
