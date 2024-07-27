const path = require("path");
const Groups = require("../models/group");

module.exports = {
  admin_dashboard: async (req, res) => {
    res.render("admin_dashboard");
  },
};
