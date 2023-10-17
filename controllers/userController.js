const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { sendOTP } = require("../util/otp");
const OTP = require("../models/otpModel");
const products = require("../models/productModel");

module.exports = {
  host: async (req, res) => {
    try {
      const email = req.session.email;
      const data = await User.findOne({ email });
      const imgs = await products.find();
      const arr = [];
      imgs.forEach((x) => {
        if (x.status == "Active") {
          arr.push(x);
        }
      });
      console.log(arr);
      res.render("user/home", { data, arr });
    } catch (error) {
      console.log("error occured at line 26");
    }
  },
  forgotPassword: async (req, res) => {
    res.render("user/forgot_pass");
  },
  verifyEmail: async (req, res) => {
    try {
      const { email } = req.body;
      await sendOTP(email); //sending otp for entered otp

      res.render("user/email_verify", { email });
    } catch (error) {
      console.log("an error occured in controller 191");
    }
  },
  comapareOtp: async (req, res) => {
    try {
      const otp = req.body.otp;
      const email = req.body.email;
      const userOTP = await OTP.find({ email });

      //comparing the user entered otp and sended otp
      if (userOTP[0].otp == otp) {
        res.render("user/newpassword", { email });
      } else {
        console.log("an error occured");
      }
    } catch (error) {
      console.log("an error occured in controller 208");
    }
  },
  //reset password
  setPassword: async (req, res) => {
    try {
      const { newpassword, email } = req.body;
      //updating new password
      const data = await User.updateOne(
        { email: email },
        { password: newpassword }
      );
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  },
  Orders: async (req, res) => {
    const imgs = await products.find();
    res.render("user/orders", { imgs });
  },
  wishList: (req, res) => {
    res.render("user/wishlist");
  },
  search: async (req, res) => {
    const value = req.body.value;
    const productDetails = await products.find({ ProductName: " " });
    console.log("value" + productDetails);
  },
};
