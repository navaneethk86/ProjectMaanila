const path = require("path");
const Groups = require("../models/group");
const Peoples = require("../models/peoples");
const Payments = require("../models/payment");

module.exports = {
  user_pay_in_notin: async (req, res) => {
    const enteredName = req.body.name;

    const peopleData = await Peoples.find({});
    const peopleNames = peopleData.map((group) => group.name);

    const peoplePayData = await Payments.find({});
    const peoplePayNames = peoplePayData.map((group) => group.name);

    console.log(peoplePayNames);
    console.log(peopleNames);

    if (
      peopleNames.includes(enteredName) &&
      !peoplePayNames.includes(enteredName)
    ) {
      const userData = peopleData.find((group) => group.name === enteredName);
      console.log(userData);
      res.json({ exists: true, userData: userData }); // Send user data along with exists status
    } else {
      res.json({ exists: false });
    }
  },
};
