const path = require("path");
const Groups = require("../models/group");
const Peoples = require("../models/peoples");
const Payments = require("../models/payment");

module.exports = {
  get_users: async (req, res) => {
    try {
      const groupName = req.query.name;

      console.log("groupName:", groupName);

      const users = await Peoples.find({ group: groupName });

      ///////////////////////////////////////////////////////

      const PaymentData = await Payments.find({ groupname: groupName });

      let totalNetAmount = 0;

      PaymentData.forEach((payment) => {
        totalNetAmount += payment.net_amount;
      });

      console.log("totalNetAmount:", totalNetAmount);

      ///////////////////////////////////////////////////////////

      const responseData = {
        users: users,
        totalNetAmount: totalNetAmount,
      };

      res.send(responseData);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
};
