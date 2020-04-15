const express = require("express");

const app = express();

// const sequelize = require("./connection");
const bodyParser = require("body-parser");
const registerRoute = require("./Routes/registerRoute");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))

app.use("/", registerRoute);
app.set("view engine", "ejs");
// const Register = require("./Models/register");
// const sendOtp = require("./Models/sendOtp");

//Register.hasMany(sendOtp, { foreignKey: "user_id" });

// sequelize
//   .sync()
//   .then((resp) => {
   
//   })
//   .catch((err) => {
//     console.log(err);
//   });
  app.listen(4000, () => console.log("server is listening", 4000));
