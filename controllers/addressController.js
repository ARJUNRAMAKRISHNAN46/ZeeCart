const Address = require("../models/addressModel");
const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const Cart = require("../models/cartModel");

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
      if(userData.refferedBy) {
        const reffered = userData.refferedBy;
        const Names = await User.findOne({ _id: reffered});
        userName = Names.name;
      }
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

      let dataCount = await Address.find({ email }).count();
      let data = await Address.find({ email })
        .skip((pageNum - 1) * perPage)
        .limit(perPage);
      let i = (pageNum - 1) * perPage;
      res.render("user/userProfile", {
        data,
        i,
        userData,
        dataCount,
        wallet,
        userNames,
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
};
