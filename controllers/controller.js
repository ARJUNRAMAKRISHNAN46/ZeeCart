const express = require("express");
const User = require("../models/model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { sendOTP } = require("../util/otp");
const { generateOTP } = require("../util/generateOTP");
const { use } = require("../router.js/userrouter");
const OTP = require("../models/otpModel");
const { Users, Brand, Catagory, productuploads } = require("../models/model");

//<-----------------------------------Hosting--------------------------------------->

async function host(req, res) {
  const email = req.session.email;
  const data = await User.Users.findOne({ email });
  const imgs = await User.productuploads.find();
  if (req.session.userlogged) {
    res.render("user/home", { data, imgs });
  } else {
    res.render("user/login", { title: "user login page", err: false });
  }
}
//<------------------------------------Get Login--------------------------------------->

async function getLogin(req, res) {
  const email = req.session.email;
  const data = await User.Users.findOne({ email });
  const imgs = await User.productuploads.find();
  if (req.session.userlogged) {
    res.render("user/home", { data, imgs });
  } else {
    res.render("user/login", { err: "" });
  }
}

//<------------------------------------post Login---------------------------------------->

async function Logged(req, res) {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const data = await User.Users.findOne({ email });
    //fetching product images from database
    const imgs = await User.productuploads.find();
    if (req.session.userlogged) {
      res.render("user/home", { data, imgs });
    } else {
      //comparing passwords
      const pass = await bcrypt.compare(password, data.password);
      //compare entered password,email and password,email in db
      if (data.email == email && data.password == password) {
        if (data.statuz == "Active") {
          req.session.userlogged = true;
          req.session.email = email;
          res.render("user/home", { data, imgs });
        } else {
          res.send({ err: "your access is denied by the admin" });
        }
      } else {
        res.send({ err: "invalid user name or password" });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// <-------------------------------------Get Send-otp------------------------------------>

async function getOpt(req, res) {
  const email = req.session.email;
  const data = await User.Users.findOne({ email });
  const imgs = await User.productuploads.find();
  if (req.session.userlogged) {
    res.render("user/home", { data, imgs });
  } else {
    res.render("user/signup", { err: "" });
  }
}

// <-------------------------------------Post Send-otp------------------------------------>

async function sendOTPController(req, res) {
  try {
    const { statuz, name, email, password } = req.body;
    console.log(statuz, name, email, password);
    //fetching user data from database
    const data = await User.Users.findOne({ email });
    const imgs = await User.productuploads.find();
    if (req.session.userlogged) {
      res.render("user/home", { data, imgs });
    } else {
      if (data) {
        console.log("email exists");
        res.render("user/signup", { err: "Email ID already exists" });
      } else {
        //creating user details in database
        const usedata = await User.Users.create(req.body);
        //sending otp to the entered email
        await sendOTP(email);
        res.render("user/otp", { email: email });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// <------------------------------------Signup--------------------------------------->

async function signUp(req, res) {
  try {
    const arr = [];
    arr.push(req.body.num1);
    arr.push(req.body.num2);
    arr.push(req.body.num3);
    arr.push(req.body.num4);
    //taking the user entered otp
    const otpNumber = arr.map(Number);
    const finalotp = Number(arr.join(""));
    const email = req.body.email;
    const userOTP = await OTP.find({ email });
    const data = await User.Users.findOne({ email });
    const imgs = await User.productuploads.find();
    //comparing the entered otp and and sending otp
    if (userOTP[0].otp == finalotp) {
      req.session.userlogged = true;
      req.session.email = email;
      res.render("user/home", { imgs, data });
    } else {
      console.log("an error occured");
    }
  } catch (error) {
    console.log(error);
  }
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

// <---------------------------------------Cart-------------------------------------->

async function productSpec(req, res) {
  try {
    const id = req.params.id;
    //fetching product details
    const prodSpec = await productuploads.findById(id);
    console.log(prodSpec, "product spec");
    res.render("user/productSpec", { prodSpec });
  } catch (error) {
    console.log(error);
  }
}

// <---------------------------------------Forgot Password----------------------------------------->

async function forgotPassword(req, res) {
  res.render("user/forgot_pass");
}

// <---------------------------------------Email verification-------------------------------------->

async function verifyEmail(req, res) {
  try {
    const {email} = req.body;
    await sendOTP(email);
    res.render("user/email_verify", { email });
  } catch (error) {
    console.log("an error occured in controller 191");
  }
}

// <---------------------------------------OTP verification-------------------------------------->

async function comapareOtp(req, res) {
  try {
    const otp = req.body.otp;
    console.log(otp);
    const email = req.body.email;
    const userOTP = await OTP.find({ email });
    if (userOTP[0].otp == otp) {
      res.render('user/newpassword',{email});
    } else {
      console.log("an error occured");
    }
  } catch (error) {
    console.log(error);
    // console.log("an error occured in controller 208");
  }
}

// <--------------------------------------------Logout---------------------------------------------->

async function setPassword(req,res) {
  const { newpassword,email } = req.body;
  const data = await User.Users.updateOne({email : email },{password : newpassword});
  res.redirect('/');
}

// <--------------------------------------------Logout---------------------------------------------->

function logOut(req, res) {
  req.session.destroy();
  res.redirect("/");
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
  productSpec,
  getOpt,
  getLogin,
  logOut,
  forgotPassword,
  verifyEmail,
  comapareOtp,
  setPassword
};
