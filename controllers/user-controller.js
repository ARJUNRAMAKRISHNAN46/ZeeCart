const express = require("express");
const router = express.Router();
const session = require("express-session");
const Users = require("../models/model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { sendOTP } = require("../util/otp");

//user login to home page
async function userLogin(req, res) {
  const { email, password } = req.body;
  const connect = await Users.findOne({ email: email });

  const pass = await bcrypt.compare(password, connect.password);

  if (connect.email == req.body.email) {
    if (password == connect.password) {
      res.render("user/home", { title: "user home page" });
    } else {
      throw Error("Invalid password");
    }
  } else {
    throw Error("User not found");
  }
}
//user sign up to home page

async function userSignup(req, res) {
  const { name, email, password } = req.body;
  // const salt= await bcrypt.genSalt(10)
  // console.log(password);
  const hash = await bcrypt.hash(password, 10);
  const connect = await Users.create({
    name: name,
    email: email,
    password: hash,
  });

  req.session.user = email;
  req.session.userlogged = true;
  res.render("user/home", { title: "user login page" });
}
//user login page to signpage
function userLogtoSign(req, res) {
  res.render("user/signup", { title: "user signing page" });
}

//user sign page to login page
function userSigntoLog(req, res) {
  res.redirect("/");
}

async function sendOTPController(req, res) {
  const { email } = req.body;
  await sendOTP(email);
  res.status(201).json({ message: "otp sent" });
}


module.exports = {
  userLogin,
  userSignup,
  userLogtoSign,
  userSigntoLog,
  sendOTPController
};
