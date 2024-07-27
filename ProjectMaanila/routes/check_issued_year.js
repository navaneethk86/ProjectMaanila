const express = require("express");
const router = express.Router();

const check_issued_year = require("../controllers/check_issued_year.js");

router.post("/check_issued_year", check_issued_year.check_issued_year);

module.exports = router;
