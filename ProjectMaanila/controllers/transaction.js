const path = require("path");
const Groups = require("../models/group");
const Transaction = require("../models/transaction");

module.exports = {
  transaction: async (req, res) => {
    const transactionData = await Transaction.find({});
    res.render("transaction", { transactionData });
  },
};
