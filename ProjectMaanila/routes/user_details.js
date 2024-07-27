const express = require("express");
const router = express.Router();

const user_details = require("../controllers/user_details.js");

router.get("/user_details", user_details.user_details);

router.get("/download", user_details.download);

module.exports = router;
