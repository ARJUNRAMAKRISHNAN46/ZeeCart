const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { sendOTP } = require("../util/otp");
const OTP = require("../models/otpModel");
const products = require("../models/productModel");
const wishlist = require("../models/wishlistModel");
const { Mongoose, ObjectId } = require("mongoose");
let userEmail;
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
      // console.log(arr);
      res.render("user/home", { data, arr });
    } catch (error) {
      console.log(error);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      res.render("user/forgot_pass");
    } catch (error) {
      console.log(error);
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const { email } = req.body;
      await sendOTP(email); //sending otp for entered otp
      userEmail = email;
      res.render("user/email_verify", { email, err: "" });
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  },
  //reset password
  setPassword: async (req, res) => {
    try {
      const { newpassword } = req.body;
      //updating new password
      const data = await User.updateOne(
        { email: userEmail },
        { password: newpassword }
      );
      if (req.session.logged) {
        res.redirect("/profile");
      } else {
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  },

  wishList: async (req, res) => {
    try {
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      let err = "";
      const Wishlist = await wishlist
        .find({ userId: userId })
        .populate("products.productId");
      if (Wishlist) {
        wishData = Wishlist[0].products;
      } else {
        err = "No Items in wishlist..!";
      }
      res.render("user/wishlist", { wishData, err });
    } catch (error) {
      console.log(error);
    }
  },
  addToWishlist: async (req, res) => {
    try {
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      const productId = req.params.id;
      const data = await wishlist.findOne({ userId: userId });
      if (data == null) {
        const wishData = await wishlist.create({
          userId: userId,
          products: [{ productId: productId }],
        });
      } else {
        await wishlist.updateOne(
          { userId: userId },
          {
            $addToSet: {
              products: {
                productId: [productId],
              },
            },
          }
        );
      }
      res.redirect("/wishlist");
    } catch (error) {
      console.log(error);
    }
  },
  removeFromWishlist: async (req, res) => {
    try {
      const email = req.session.email;
      const userData = await User.find({ email: email });
      console.log("userid" + userData[0]._id);
      const productId = req.params.id;
      console.log("proid" + productId);
      await wishlist.updateOne(
        { userId: userData[0]._id },
        {
          $pull: {
            products: {
              productId: productId,
            },
          },
        }
      );
      res.redirect("/wishlist");
    } catch (error) {
      console.log(error);
    }
  },
  search: async (req, res) => {
    try {
      const value = req.body.value;
      const productDetails = await products.find({
        $or: [{ Brand: "value" }, { Category: "value" }],
      });
      console.log("Search results:", productDetails);
    } catch (error) {
      console.log(error);
    }
  },
  changePassword: async (req, res) => {
    try {
      const email = req.session.email;
      console.log(email);
      res.render("user/changePassword");
    } catch (error) {
      console.log(error);
    }
  },
};
