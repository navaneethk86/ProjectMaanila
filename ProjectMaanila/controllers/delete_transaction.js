const path = require("path");
const Payments = require("../models/payment");

module.exports = {
  delete_transaction_get: async (req, res) => {
    res.render("delete_transaction");
  },

  delete_transaction: async (req, res) => {
    console.log(req.body);

    try {
      const user = await Payments.findOne({ name: req.body.name });

      const donation = user.donation;

      const monthly = user.monthly_pay[req.body.year];
      const yearly = user.yearly_pay[req.body.year];

      res.json({ donation: donation, monthly: monthly, yearly: yearly });
    } catch (err) {
      console.error(err);
    }
  },
};
