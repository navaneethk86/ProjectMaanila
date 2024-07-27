const path = require("path");
const Groups = require("../models/group");
const Peoples = require("../models/peoples");
const Payments = require("../models/payment");
const Budget = require("../models/budget");
const Transaction = require("../models/transaction");

const fs = require("fs");
// const pdf = require("pdfkit");
const ejs = require("ejs");
const pdf = require("html-pdf");

module.exports = {
  payment_update: async (req, res) => {
    const { username, paymentType, year, amount } = req.body;
    console.log(username, paymentType, year, amount);

    const currentYear = await Budget.findOne({ issuedYear: year });

    const issuedMonthlyAmt = currentYear.monthlyAmount;
    const issuedYearlyAmt = currentYear.yearlyAmount;

    if (paymentType === "donation") {
      try {
        const user = await Payments.findOne({ name: username });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        console.log(typeof user.net_amount);

        console.log(typeof amount);

        user.net_amount = user.net_amount + amount;

        user.donation.push({
          amount: amount,
          timestamp: new Date(),
        });

        await user.save();

        //////////////////////////////////////////////////////////////////////////////
        const newTransaction = new Transaction({
          name: username,
          amount: amount,
          type: paymentType,
          groupname: user.groupname,
          year: year,
          date: new Date(),
        });

        newTransaction.save();
        ///////////////////////////////////////////////////////////////////////////////

        return res.json({
          success: true,
          amount: amount,
          name: username,
          type: "ಧನ ಸಹಾಯ(Donation)",
        });
      } catch (error) {
        console.error("Error updating payment:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    if (paymentType === "monthly") {
      try {
        const user = await Payments.findOne({ name: username });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const monthly_pay = user.monthly_pay[year];

        const netMonthlyAmount = monthly_pay
          .filter((entry) => entry.amount != null)
          .reduce((total, entry) => total + entry.amount, 0);

        console.log("Net Monthly Amount:", netMonthlyAmount);
        console.log("issued Monthly Amount:", issuedMonthlyAmt);

        if (netMonthlyAmount >= issuedMonthlyAmt) {
          user.net_amount = user.net_amount + amount;

          user.donation.push({
            amount: amount,
            timestamp: new Date(),
          });

          await user.save(); //no need
          ///////////////////////////////////////////////////////////////////////////////////
          const newTransaction = new Transaction({
            name: username,
            amount: amount,
            type: paymentType,
            groupname: user.groupname,
            year: year,
            date: new Date(),
          });

          newTransaction.save();

          ///////////////////////////////////////////////////////////////////////////////////
          return res.json({
            success: true,
            amount: amount,
            name: username,
            type: "ತಿಂಗಳಿನ ಶುಲ್ಕ(Monthly Fees)",
          });
        }

        //if admin update and decrease the budget then it will not execute these codes and if (netMonthlyAmount >= issuedMonthlyAmt)  this becomes true

        const pendingAmt = issuedMonthlyAmt - netMonthlyAmount;

        if (amount > pendingAmt) {
          user.net_amount = user.net_amount + amount;

          const remainingAmt = amount - pendingAmt;

          user.monthly_pay[year].push({
            amount: pendingAmt,
            timestamp: new Date(),
          });

          user.donation.push({
            amount: remainingAmt,
            timestamp: new Date(),
          });

          ///////////////////////////////////////////////////////////////////////////////////
          const newTransaction = new Transaction({
            name: username,
            amount: amount,
            type: paymentType,
            groupname: user.groupname,
            year: year,
            date: new Date(),
          });

          newTransaction.save();

          ///////////////////////////////////////////////////////////////////////////////////
        }

        if (amount <= pendingAmt) {
          user.net_amount = user.net_amount + amount;

          user.monthly_pay[year].push({
            amount: amount,
            timestamp: new Date(),
          });

          ///////////////////////////////////////////////////////////////////////////////////
          const newTransaction = new Transaction({
            name: username,
            amount: amount,
            type: paymentType,
            groupname: user.groupname,
            year: year,
            date: new Date(),
          });

          newTransaction.save();

          ///////////////////////////////////////////////////////////////////////////////////
        }
        await user.save();

        return res.json({
          success: true,
          amount: amount,
          name: username,
          type: "ತಿಂಗಳಿನ ಶುಲ್ಕ(Monthly Fees)",
        });
      } catch (error) {
        console.error("Error updating payment:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    if (paymentType === "yearly") {
      try {
        const user = await Payments.findOne({ name: username });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const yearly_pay = user.yearly_pay[year];

        const netYearlyAmount = yearly_pay
          .filter((entry) => entry.amount != null)
          .reduce((total, entry) => total + entry.amount, 0);

        console.log("Net Monthly Amount:", netYearlyAmount);
        console.log("issued Monthly Amount:", issuedYearlyAmt);

        if (netYearlyAmount >= issuedYearlyAmt) {
          user.net_amount = user.net_amount + amount;

          user.donation.push({
            amount: amount,
            timestamp: new Date(),
          });

          await user.save();

          ///////////////////////////////////////////////////////////////////////////////////
          const newTransaction = new Transaction({
            name: username,
            amount: amount,
            type: paymentType,
            groupname: user.groupname,
            year: year,
            date: new Date(),
          });

          newTransaction.save();

          ///////////////////////////////////////////////////////////////////////////////////
          return res.json({
            success: true,
            amount: amount,
            name: username,
            type: "ವಾರ್ಷಿಕ ನೆಮೋತ್ಸವ(Annual Nemothsava)",
          });
        }

        const pendingYearlyAmt = issuedYearlyAmt - netYearlyAmount;

        if (amount > pendingYearlyAmt) {
          user.net_amount = user.net_amount + amount;

          const remainingYearlyAmt = amount - pendingYearlyAmt;

          user.yearly_pay[year].push({
            amount: pendingYearlyAmt,
            timestamp: new Date(),
          });

          user.donation.push({
            amount: remainingYearlyAmt,
            timestamp: new Date(),
          });

          ///////////////////////////////////////////////////////////////////////////////////
          const newTransaction = new Transaction({
            name: username,
            amount: amount,
            type: paymentType,
            groupname: user.groupname,
            year: year,
            date: new Date(),
          });

          newTransaction.save();

          ///////////////////////////////////////////////////////////////////////////////////
        }

        if (amount <= pendingYearlyAmt) {
          user.net_amount = user.net_amount + amount;

          user.yearly_pay[year].push({
            amount: amount,
            timestamp: new Date(),
          });

          ///////////////////////////////////////////////////////////////////////////////////
          const newTransaction = new Transaction({
            name: username,
            amount: amount,
            type: paymentType,
            groupname: user.groupname,
            year: year,
            date: new Date(),
          });

          newTransaction.save();

          ///////////////////////////////////////////////////////////////////////////////////
        }

        await user.save();

        return res.json({
          success: true,
          amount: amount,
          name: username,
          type: "ವಾರ್ಷಿಕ ನೆಮೋತ್ಸವ(Annual Nemothsava)",
        });
      } catch (error) {
        console.error("Error updating payment:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  },

  generate_bill: async (req, res) => {
    try {
      const { name, amount, type } = req.body;

      console.log(name, amount);

      let user = await Peoples.findOne({ name: name });

      if (!user) throw Error("User not found");

      const ejsFilePath = path.join(__dirname, "..", "views", "bill.ejs");

      const date = new Date();
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });

      // Render EJS template to HTML
      const html = await ejs.renderFile(ejsFilePath, {
        user: user,
        amount: amount,
        date: formattedDate,
        type: type,
      });

      // Create PDF from HTML content
      pdf.create(html).toBuffer((err, buffer) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error generating PDF");
        }

        // Set response headers to indicate PDF content
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=bill.pdf");

        // Stream PDF buffer back to the client
        res.send(buffer);
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  },
};
