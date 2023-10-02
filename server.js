const express = require("express");
const path = require("path");
require("dotenv").config();
const session = require("express-session");
const router = require("./router.js/userrouter");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");
const routers = require("./router.js/adminrouter");
const { sendMail } = require("./util/mail");
const OTP = require("./models/otpModel");
const { sendOTP } = require("./util/otp");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.set("view engine", "ejs");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static("public"));

app.use("/", router);
app.use("/", routers);

app.use(passport.initialize());

require("./authenticate");

mongoose.connect(process.env.MONGO_URI).then(() =>
  app.listen(4000, () => {
    console.log("server running in http://localhost:4000");
  })
);
