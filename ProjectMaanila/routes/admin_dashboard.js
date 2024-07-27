const express = require("express");
const router = express.Router();

const admin_dashboard = require("../controllers/admin_dashboard.js");

router.get("/admin_dashboard", admin_dashboard.admin_dashboard);

module.exports = router;
