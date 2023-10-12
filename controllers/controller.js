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
  if (req.session.email) {
    res.render("user/home", { data, imgs });
  } else {
    res.render("user/login", { title: "user login page", err: '' });
  }
}

//<------------------------------------Get Login--------------------------------------->

async function getLogin(req, res) {
  const email = req.session.email;
  const data = await User.Users.findOne({ email });
  const imgs = await User.productuploads.find();
  if (req.session.email) {
    res.redirect('/');
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
    if (req.session.emai) {
      res.redirect('/');
    } else {
      //comparing passwords
      const pass = await bcrypt.compare(password, data.password);
      //compare entered password,email and password,email in db
      if (data.email == email && data.password == password) {
        if (data.statuz == "Active") {
          req.session.email = email;
          console.log(req.session.email);//--------------------------------------------------------->
          res.redirect('/')
        } else {
          res.redirect('/access-denied');
        }
      } else {
        res.redirect('/invalid-user')
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// <-------------------------------------access denied------------------------------------>

async function throwErrOne(req,res) {
  res.render('user/login',{ err: "your access is denied by the admin" });//throwing an error when the user was blocked by admin
}

// <-------------------------------------invalid user------------------------------------>

async function throwErrTwo(req,res) {
  res.render('user/login',{ err: "invalid username or password" });
}

// <-------------------------------------Get Send-otp------------------------------------>

async function getOpt(req, res) {
  const email = req.session.email;
  const data = await User.Users.findOne({ email });//searching for email if it is already registered or not
  const imgs = await User.productuploads.find();
  if (req.session.email) {
    res.redirect('/');
  } else {
    res.render("user/signup", { err: "" });
  }
}

// <-------------------------------------Post Send-otp------------------------------------>

async function sendOTPController(req, res) {
  try {
    const { statuz, name, email, password } = req.body;
    console.log(statuz, name, email, password);//fetching user data from database
    const data = await User.Users.findOne({ email });
    const imgs = await User.productuploads.find();
    if (req.session.emai) {
      res.redirect('/');
    } else {
      if (data) {
        res.redirect('/');
      } else {
        //creating user details in database
        const usedata = await User.Users.create(req.body);
        //sending otp to the entered email
        await sendOTP(email);
        res.render("user/otp", {err : '', email: email });
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
      req.session.email = email;
      res.redirect('/');
    } else {
      res.render('user/otp',{ err: "Invalid otp",email});
    }
  } catch (error) {
    console.log(error);
  }
}

// <-------------------------------------error otp--------------------------------------->

async function throwErrThree(req,res) {
  const email = req.body.email
  console.log(email);
  res.render('user/otp',{ err: "Email ID already exists",email});
}

// <-------------------------------------Wishlist--------------------------------------->

async function Orders(req, res) {
  const imgs = await User.productuploads.find();
  console.log(imgs);
  res.render("user/orders",{imgs});
}

// <-------------------------------------Profile------------------------------------->

async function Profile(req, res) {
  res.render("user/profile");
}

// <--------------------------------------Orders------------------------------------->

async function wishList(req, res) {
  res.render("user/wishlist");
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
    await sendOTP(email);//sending otp for entered otp 

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
    console.log('uer'+userOTP[0].otp);
    console.log("otp"+otp);
    //comparing the user entered otp and sended otp
    if (userOTP[0].otp == otp) {
      res.render('user/newpassword',{email});
    } else {
      console.log("an error occured");
    }
  } catch (error) {
    // console.log(error);
    console.log("an error occured in controller 208");
  }
}

// <--------------------------------------------Set password---------------------------------------------->
//reset password 
async function setPassword(req,res) {
 try {
  const { newpassword,email } = req.body;
  //updating new password
  const data = await User.Users.updateOne({email : email },{password : newpassword});
  res.redirect('/');
 } catch (error) {
  console.log(error);
 }
}

// <--------------------------------------------Logout---------------------------------------------->

//log out section
function logOut(req, res) {
  req.session.destroy();
  res.redirect("/");
}
//product list for user
async function productList(req,res){
  const imgs = await User.productuploads.find();
  console.log(imgs);
  res.render('user/product_list',{imgs});
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
  setPassword,
  throwErrOne,
  throwErrTwo,
  throwErrThree,
  productList
};
