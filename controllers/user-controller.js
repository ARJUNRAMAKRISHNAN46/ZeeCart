const express = require("express");
const User = require("../models/model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { sendOTP } = require("../util/otp");
const { generateOTP } = require("../util/generateOTP");
const { use } = require("../router.js/userrouter");

//Login page
async function Logged(req, res) {
    res.render("user/newhome");

//   const { email, password } = req.body;
//   const connect = await User.Users.findOne({ email });
//   console.log(connect);
//   const pass = await bcrypt.compare(password, connect.password);

//   if (connect.email == email) {
//     if (connect.password == password) {
//       res.render("user/home");
//     } else {
//       throw Error("invalid password");
//     }
//   } else {
//     throw Error("User not found");
//   }
}

//user login to home page
async function userLogin(req, res) {
  const { email, password } = req.body;
  //   const connect = await User.Users.findOne({ email: email });
  //   const pass = await bcrypt.compare(password, connect.password);

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
  // console.log(password); `
  //   const newemail = User.Users.findOne({ email : req.body.email });
  //   if (newemail) {
  //     console.log("Email already exists");
  //   } else {
  if (generateOTP === req.body.otp) {
    console.log("otp verified");

    if (req.body.password === req.body.confirmpassword) {
      const hash = await bcrypt.hash(password, 10);
      const connect = await User.Users.create({ name, email, password });

      req.session.user = email;
      req.session.userlogged = true;
      res.render("user/home", { title: "user login page" });
    } else {
      console.log("passwords are not match");
    }
  }
}
// }
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
  sendOTPController,
//   Logged,
};
