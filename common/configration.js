const nodemailer = require("nodemailer");
const config = require("./mailConfig");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.username,
    pass: config.password,
  },
});

module.exports = transporter;
