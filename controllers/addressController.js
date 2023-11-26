const Address = require("../models/addressModel");
const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const Cart = require("../models/cartModel");
const WalletHistory = require("../models/walletHistoryModel");
const Order = require('../models/ordersModel');

module.exports = {
  //get user profile page
  Profile: async (req, res) => {
    try {
      const pageNum = req.query.page;
      const perPage = 2;
      let email = req.session.email;
      let userData = await User.findOne({ email: email });
      const userId = userData._id;
      let userName;
      if (userData.refferedBy) {
        const reffered = userData.refferedBy;
        const Names = await User.findOne({ _id: reffered });
        userName = Names.name;
      }
      const wallet = await Wallet.findOne({ userId: userId });

      let dataCount = await Address.find({ userId }).count();
      let data = await Address.find({ userId })
        .skip((pageNum - 1) * perPage)
        .limit(perPage);
      let i = (pageNum - 1) * perPage;
      res.render("user/userProfile", {
        data,
        i,
        userData,
        dataCount,
        wallet,
        userName,
      });
    } catch (error) {
      console.log(error);
    }
  },
  //get edit address
  getEditAddress: async (req, res) => {
    try {
      const addressId = req.params.id;
      const address = await Address.findOne({ _id: addressId });
      res.render("user/editAddress", { address });
    } catch (error) {
      console.log(error);
    }
    await Address.updateOne();
  },
  //post edit address
  postEditAddress: async (req, res) => {
    try {
      const {
        id,
        name,
        mobile,
        email,
        pincode,
        address,
        locality,
        city,
        district,
        state,
      } = req.body;

      await Address.updateOne(
        { _id: id },
        {
          name: name,
          mobile: mobile,
          email: email,
          pincode: pincode,
          address: address,
          locality: locality,
          city: city,
          district: district,
          state: state,
        }
      );
      res.redirect("/profile?page=1");
    } catch (error) {}
  },
  //deleting address from user profile
  deleteAddress: async (req, res) => {
    try {
      const addressId = req.params.id;
      await Address.deleteOne({ _id: addressId });
      res.redirect("/profile?page=1");
    } catch (error) {
      console.log(error);
    }
  },
  //placing order
  placeOrder: async (req, res) => {
    try {
      let email = req.session.email;
      let address = await Address.find({ email });
      console.log(address,'addresssssssss------------------>');
      let userId = await User.findOne({ email });
      const coupon = req.session.coupon;
      const couponCode = req.session.couponCode;
      const cart = await Cart.findOne({ userId: userId._id }).populate(
        "products.productId"
      );
      if (cart !== null) {
        if (cart.products[0]) {
          const total = req.session.totalPrice;
          const grandTotal = req.session.grandTotal;
          res.render("user/selectAddress", {
            address,
            userId,
            total,
            grandTotal,
            coupon,
            couponCode,
          });
        } else {
          res.redirect("/");
        }
      } else {
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  },
  getAddUserAddress: async (req, res) => {
    try {
      const email = req.session.email;
      const userId = await User.findOne({ email });
      res.render("user/addUserAddress", { userId });
    } catch (error) {
      console.log(error);
    }
  },
  addNewAddress: async (req, res) => {
    try {
      await Address.create(req.body);
      res.redirect("/placeOrder");
    } catch (error) {
      console.log(error);
    }
  },
  getAddAddress: async (req, res) => {
    try {
      const email = req.session.email;
      const userId = await User.findOne({ email });
      res.render("user/addAddress", { userId });
    } catch (error) {
      console.log(error);
    }
  },
  //getting user address adding page
  //adding new user address
  addAddress: async (req, res) => {
    try {
      await Address.create(req.body);
      res.redirect("/profile?page=1");
    } catch (error) {
      console.log(error);
    }
  },
  WalletHistory: async (req, res) => {
    try {
      const pageNum = req.query.page;
      const perPage = 5;
      let email = req.session.email;
      let userData = await User.findOne({ email: email });
      const userId = userData._id;
      const wallet = await Wallet.findOne({ userId: userId });

      let userNames = [];
      if (wallet !== null) {
        for (const userId of wallet.invited) {
          try {
            const user = await User.findOne({ _id: userId });
            userNames.push(user.name);
          } catch (error) {
            console.error(`Error fetching user with ID ${userId}:`, error);
          }
        }
      }
      const Count = await WalletHistory.findOne({
        userId: userId,
      }).count();
      const walletHistory = await WalletHistory.findOne({ userId: userId })
        .skip((pageNum - 1) * perPage)
        .limit(perPage);
      const num = (pageNum - 1) * perPage;

      let dateArr = [];
      walletHistory.refund.forEach((x) => {
        const dateString = x.date;
        const parsedDate = new Date(dateString);
        const year = parsedDate.getFullYear();
        const month = parsedDate.getMonth() + 1;
        const day = parsedDate.getDate();
        const hours = parsedDate.getHours();
        const minutes = parsedDate.getMinutes();
        const seconds = parsedDate.getSeconds();
        const formattedDateTime = `${year}-${month < 10 ? "0" : ""}${month}-${
          day < 10 ? "0" : ""
        }${day} ${hours}:${minutes}:${seconds}`;
        dateArr.push(formattedDateTime);
      });

      res.render("user/walletHistory", {
        userNames,
        walletHistory,
        dateArr,
        num,
        Count,
      });
    } catch (error) {
      console.log(error);
    }
  },
  walletPayment: async (req, res) => {
    try {
      let email = req.session.email;
      let userData = await User.findOne({ email: email });
      const userId = userData._id;
      const totalAmount = req.session.totalPrice;
      const grandTotal = req.session.grandTotal;
      let amount;
      if (grandTotal) {
        amount = grandTotal;
      } else {
        amount = totalAmount;
      }
      const walletAmount = await Wallet.findOne({ userId });

      if (walletAmount) {
        if (walletAmount.wallet >= amount) {
          const newPrice = walletAmount.wallet - amount;
          const walletData = await Wallet.updateOne({
            userId: userId,
            $set: { wallet: newPrice },
          });
          const addressId = req.params.id;
          const curAdd = await Address.findOne({ _id: addressId });
          const orderData = await Cart.findOne();
          const currentDate = new Date();
          const fourDaysLater = new Date(currentDate);
          fourDaysLater.setDate(currentDate.getDate() + 4);
          const order = await Order.create({
            userId: orderData.userId,
            products: orderData.products,
            address: {
              houseName: curAdd.houseName,
              locality: curAdd.locality,
              city: curAdd.city,
              district: curAdd.district,
              state: curAdd.curAddstate,
              pincode: curAdd.pincode,
            },
            orderDate: currentDate.toDateString(),
            expectedDeliveryDate: fourDaysLater.toDateString(),
            paymentMethod: "Wallet",
            PaymentStatus: "Paid",
            totalAmount: amount,
            orderStatus: "Order Processed",
          });
          const refund = await Wallet.findOne({ userId: userId });
          if (refund) {
            const walletHistory = await WalletHistory.findOne({
              userId: userId,
            });
            if (walletHistory !== null) {
              const reason = "Product Purchase With Wallet Amount";
              const type = "debit";
              const date = new Date();
              await WalletHistory.updateMany({
                userId: userId,
                $push: {
                  refund: {
                    amount: amount,
                    reason: reason,
                    type: type,
                    date: date,
                  },
                },
              });
            } else {
              const reason = "Product Purchase With Wallet Amount";
              const type = "debit";
              const date = new Date();
              await WalletHistory.create({
                userId: userId,
                refund: [
                  {
                    amount: amount,
                    reason: reason,
                    type: type,
                    date: date,
                  },
                ],
              });
            }
            res.json({
              success: true,
            });
          } else {
            res.json({
              success: false,
            });
          }
        } else {
          res.json({
            success: false,
          });
        }
      } else {
        res.json({
          success: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
