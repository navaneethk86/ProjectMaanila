const express = require("express");
const router = express.Router();

const transaction = require("../controllers/transaction.js");

router.get("/transaction", transaction.transaction);

module.exports = router;
