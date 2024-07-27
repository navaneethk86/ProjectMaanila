const path = require("path");
const excelJS = require("exceljs");

const Peoples = require("../models/peoples");

const Payments = require("../models/payment");

module.exports = {
  user_details: async (req, res) => {
    res.render("user_details");
  },
  download: async (req, res) => {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    const peopleData = await Peoples.find({});

    worksheet.columns = [
      { header: "Name", key: "name", width: 10 },
      { header: "MotherName", key: "motherName", width: 10 },
      { header: "Age", key: "age", width: 10 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Mobile Number", key: "mobileNo", width: 15 },
      { header: "Marital Status", key: "maritalStatus", width: 10 },
      { header: "Job", key: "job", width: 10 },
      { header: "Address", key: "address", width: 10 },
      { header: "Group", key: "group", width: 10 },
      { header: "Eligible", key: "eligible", width: 15 },
      { header: "Eligibility Date", key: "eligibilityOn", width: 10 },
    ];

    worksheet.addRows(peopleData);

    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=people.xlsx"
        );
        res.send(buffer);
      })
      .catch((err) => {
        console.error("Error generating Excel file:", err);
        res.status(500).send("Error generating Excel file");
      });
  },
};
