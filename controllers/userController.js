const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { sendOTP } = require("../util/otp");
const OTP = require("../models/otpModel");
const products = require("../models/productModel");
const order = require("../models/ordersModel");
const { Mongoose, ObjectId } = require("mongoose");
const crypto = require("crypto");
const { log } = require("console");
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

let userEmail;
module.exports = {
  host: async (req, res) => {
    try {
      const searchQuery = req.body.search;

      if (searchQuery) {
        const productDetails = await products.find({});
      } else {
        const email = req.session.email;
        const data = await User.findOne({ email });
        const imgs = await products.find();
        const arr = [];
        imgs.forEach((x) => {
          if (x.status == "Active") {
            arr.push(x);
          }
        });
        const BudgetMob = await products
          .find({ Category: "MOST SELLING MOBILES" })
          .limit(8);
        let BudgetMobiles = [];
        BudgetMob.forEach((x) => {
          if (x.status == "Active") {
            BudgetMobiles.push(x);
          }
        });
        const FlagMob = await products
          .find({ Category: "FLAGSHIP MOBILES" })
          .limit(8);
        let FlagMobiles = [];
        FlagMob.forEach((x) => {
          if (x.status == "Active") {
            FlagMobiles.push(x);
          }
        });
        res.render("user/home", { data, arr, BudgetMobiles, FlagMobiles });
      }
    } catch (error) {
      console.log(error);
    }
  },
  guestPage: async (req, res) => {
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
      res.render("user/guestHome", { data, arr });
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
  search: async (req, res) => {
    try {
      const data = req.body.search;
      const imgs = await products.find({
        $or: [
          { BrandName: { $regex: "^" + data, $options: "i" } },
          { Category: { $regex: "^" + data, $options: "i" } },
          { ProductName: { $regex: "^" + data, $options: "i" } },
        ],
      });
      res.render("user/shop", { imgs });
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
  admin_Users: async (req, res) => {
    try {
      //creating pagination
      const pageNum = req.query.page;
      const perPage = 5;
      const dataCount = await User.find().count();
      // console.log(countData);
      const userData = await User.find()
        .skip((pageNum - 1) * perPage)
        .limit(perPage);
      let i = (pageNum - 1) * perPage;
      res.render("admin/userList", {
        title: "admin-user list",
        userData,
        i,
        dataCount,
      });
    } catch (error) {
      console.log(error);
    }
  },
  user_Blocking: async (req, res) => {
    try {
      //user control (user blocking and unblocking)
      const id = req.params.id;
      const blockData = await User.findOne({ _id: id });
      if (blockData.statuz == "Active") {
        const blocked = await User.updateOne(
          { _id: id },
          { statuz: "Blocked" }
        );
      } else if (blockData.statuz == "Blocked") {
        const blocked = await User.updateOne({ _id: id }, { statuz: "Active" });
      }
      //setting pagination for admin-user controller page
      const pageNum = req.query.page;
      const perPage = 10;
      const userData = await User.find()
        .skip((pageNum - 1) * perPage)
        .limit(perPage);
      let i = (pageNum - 1) * perPage;

      // res.render("admin/userList", { title: "admin-user list", userData, i,dataCount });
      res.redirect("/customers");
    } catch (error) {
      console.log("an error occured in userlist");
    }
  },
  downloadInvoice: async (req, res) => {
    try {
      const orderData = await order
        .findOne({
          _id: req.body.orderId,
        })
        .populate("Address")
        .populate("Items.ProductId");
      console.log("order data ====", orderData);
      const filePath = await invoice.order(orderData);
      const orderId = orderData._id;
      res.json({ orderId });
    } catch (error) {
      console.error("Error in downloadInvoice:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  downloadfile: async (req, res) => {
    const id = req.params._id;
    const filePath = `C:/Users/user/Desktop/Ticker/public/pdf/${id}.pdf`;
    res.download(filePath, `invoice.pdf`);
  },

  verifyPayment: async (req, res) => {
    console.log("it is the body", req.body);
    let hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);
    console.log(
      req.body.payment.razorpay_order_id +
        "|" +
        req.body.payment.razorpay_payment_id
    );
    hmac.update(
      req.body.payment.razorpay_order_id +
        "|" +
        req.body.payment.razorpay_payment_id
    );

    hmac = hmac.digest("hex");
    console.log(
      hmac,
      "hmacccccccccccccccccccccc------------------------------------------"
    );
    if (hmac === req.body.payment.razorpay_signature) {
      const orderId = req.body.order.receipt;
      console.log(orderId, "orderIdddddddddddddddddddddddddd");
      console.log("reciept", req.body.order.receipt);
      console.log(
        req.body.orderId,
        "-------------------------------------------------------------------------------------------------------------------orderid"
      );
      const orderID = req.body.orderId;
      const updateOrderDocument = await order.findByIdAndUpdate(orderID, {
        PaymentStatus: "Paid",
        paymentMethod: "Online",
      });
      console.log("hmac success");
      res.json({ success: true });
    } else {
      console.log("hmac failed");
      res.json({ failure: true });
    }
  },
};
