const express = require("express");
const router = express.Router();

const delete_transaction = require("../controllers/delete_transaction.js");

router.get("/delete_transaction", delete_transaction.delete_transaction_get);
router.post("/delete_transaction", delete_transaction.delete_transaction);

module.exports = router;
