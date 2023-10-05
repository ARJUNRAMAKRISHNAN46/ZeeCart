const express = require("express");
const User = require("../models/model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { sendOTP } = require("../util/otp");
const { generateOTP } = require("../util/generateOTP");
const { use } = require("../router.js/userrouter");

//<-----------------------------------Hosting--------------------------------------->

async function host(req, res) {
  if (req.session.userlogged) {
    res.render("users/newhome");
  } else {
    res.render("user/newlogin", { title: "user login page", err: false });
  }
}

//<------------------------------------Login---------------------------------------->

async function Logged(req, res) {
  const { email, password } = req.body;
  console.log(email, password);

  const data = await User.Users.findOne({ email });
  console.log(data);
  const Name = data.name;
  const pass = await bcrypt.compare(password, data.password);
  const imgs = await User.productuploads.find()
  console.log(imgs);

  if (data.email == email && data.password == password) {
    req.session.logged = true;
    res.render("user/home", { Name, imgs });
  } else {
    res.send({ err: "invalid user name or password" });
  }
}

// <-------------------------------------Send-otp------------------------------------>

async function sendOTPController(req, res) {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  const value = await User.Users.findOne({ email });
  if (value) {
    res.render("user/newlogin", { err: "Email ID already exists" });
  } else {
    // const usedata = await User.Users.create(req.body);
    await sendOTP(email);
    res.render("user/otp");
  }
}

// <------------------------------------Signup--------------------------------------->

async function signUp(req, res) {
  
  const arr = [];
  arr.push(req.body.num1);
  arr.push(req.body.num2);
  arr.push(req.body.num3);
  arr.push(req.body.num4);
  const otpNumber = arr.map(Number);
  const finalotp = Number(arr.join(""));
  console.log('finalotp '+finalotp);

  console.log(req.session.otp);

  //   if (recievedotp === generateOTP) {
  //     const data = sendOTPController();
  //     console.log(data);
  //     res.render("user/home");
  //   } else {
  //     res.send({ err: "Incorrect OTP" });
  //   }
}

// <-------------------------------------Wishlist--------------------------------------->

async function wishList(req, res) {
  res.render("user/wishlist");
}

// <-------------------------------------Profile------------------------------------->

async function Profile(req, res) {
  res.render("user/profile");
}

// <--------------------------------------Orders------------------------------------->

async function Orders(req, res) {
  res.render("user/orders");
}

// <---------------------------------------Cart-------------------------------------->

async function Cart(req, res) {
  res.render("user/cart");
}

module.exports = {
  host,
  Logged,
  wishList,
  Profile,
  Orders,
  Cart,
  signUp,
  sendOTPController,
};
