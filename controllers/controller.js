const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const Products = require("../models/productModel");
const { sendOTP } = require("../util/otp");
const Wallet = require("../models/walletModel");
const WalletHistory = require("../models/walletHistoryModel");

var _email;
var _name;
var _statuz;
var _password;
var _referal;
module.exports = {
  //get login
  getLogin: async (req, res) => {
    try {
      res.render("user/login", { err: "" });
    } catch (error) {}
  },
  //post login
  postLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      _email = email;
      _password = password;
      const userData = await User.findOne({ email });
      const products = await Products.find();

      if (userData.email == email && userData.password == password) {
        if (userData.statuz == "Active") {
          req.session.logged = true;
          req.session.email = _email;
          res.redirect("/");
        } else {
          res.redirect("/access-denied");
        }
      } else {
        res.redirect("/invalid-user");
      }
    } catch (error) {
      console.log(error);
    }
  },
  //throwing access denied error
  throwErrOne: async (req, res) => {
    //throwing an error when the user was blocked by admin
    try {
      res.render("user/login", { err: "your access is denied by the admin" });
    } catch (error) {
      console.log(error);
    }
  },
  //throwing invalid user error
  throwErrTwo: async (req, res) => {
    try {
      res.render("user/login", { err: "invalid username or password" });
    } catch (error) {
      console.log(error);
    }
  },
  //get signup
  getSignupOtp: async (req, res) => {
    try {
      const referal = req.query.ref;
      res.render("user/signup", { err: "", referal });
    } catch (error) {
      console.log(error);
    }
  },
  //post signup
  postSignupOtp: async (req, res) => {
    try {
      const { statuz, name, email, password, referal } = req.body;
      const data = await User.findOne({ email });
      if (data) {
        // res.redirect("user/invalid-email");
        res.render("user/signup", { err: "email already exists" });
      } else {
        _email = email;
        _name = name;
        _statuz = statuz;
        _password = password;
        _referal = referal;

        await sendOTP(_email);
        // const referal = req.body.referal;

        setTimeout(async () => {
          await OTP.deleteOne({ email: email });
        }, 30000);
        res.redirect("/getSignup");
      }
    } catch (error) {
      console.log(error);
    }
  },
  getSignup: async (req, res) => {
    try {
      let email = _email;
      res.render("user/otp", { err: "", email });
    } catch (error) {
      console.log(error);
    }
  },
  postSignup: async (req, res) => {
    try {
      const arr = [];
      arr.push(req.body.num1);
      arr.push(req.body.num2);
      arr.push(req.body.num3);
      arr.push(req.body.num4);
      const otpNumber = arr.map(Number);
      const finalotp = Number(arr.join(""));
      const email = _email;
      const name = _name;
      const statuz = _statuz;
      const password = _password;
      const userOTP = await OTP.find({ email });
      if (userOTP[0].otp == finalotp) {
        req.session.logged = true;
        req.session.email = email;
        const referal = _referal;
        const usedata = await User.create({
          email: email,
          statuz: statuz,
          name: name,
          password: password,
          refferedBy: referal,
        });
        const preUserId = usedata._id;
        if (referal) {
          const userData = await Wallet.findOne({ userId: referal });

          if (userData !== null) {
            const waldata = await Wallet.updateOne(
              { userId: referal },
              {
                $inc: { wallet: 100 },
                $push: { invited: preUserId },
              }
            );
            const walletHistory = await WalletHistory.findOne({
              userId: referal,
            });
            if (walletHistory !== null) {
              const reason = "Referal Bonus";
              const type = "credit";
              const date = new Date();
              await WalletHistory.updateMany({
                userId: referal,
                $push: {
                  refund: {
                    amount: 100,
                    reason: reason,
                    type: type,
                    date: date,
                  },
                },
              });
            } else {
              const reason = "Referal Bonus";
              const type = "credit";
              const date = new Date();
              await WalletHistory.create({
                userId: referal,
                refund: [
                  {
                    amount: 100,
                    reason: reason,
                    type: type,
                    date: date,
                  },
                ],
              });
            }
          } else {
            const walletHistory = await WalletHistory.findOne({
              userId: referal,
            });
            if (walletHistory !== null) {
              const reason = "Referal Bonus";
              const type = "credit";
              const date = new Date();
              await WalletHistory.updateMany({
                userId: referal,
                $push: {
                  refund: {
                    amount: 100,
                    reason: reason,
                    type: type,
                    date: date,
                  },
                },
              });
            } else {
              const reason = "Referal Bonus";
              const type = "credit";
              const date = new Date();
              await WalletHistory.create({
                userId: referal,
                refund: [
                  {
                    amount: 100,
                    reason: reason,
                    type: type,
                    date: date,
                  },
                ],
              });
            }
            await Wallet.create({
              userId: referal,
              wallet: 100,
              invited: [preUserId],
            });
          }
        }
        res.redirect("/");
      } else {
        res.redirect("/invalid-otp");
      }
    } catch (error) {
      console.log(error);
    }
  },
  //Throwing an error
  throwErrThree: (req, res) => {
    try {
      res.render("user/otp", { err: "Invalid otp" });
    } catch (error) {
      console.log(error);
    }
  },
  resendOtp: async (req, res) => {
    try {
      const { statuz, name, email, password } = req.body;
      const data = await User.findOne({ _email });
      sendOTP(_email);

      res.render("user/otp", {
        err: "",
        email: _email,
        statuz: _statuz,
        name: _name,
        password: _password,
      });
    } catch (error) {
      console.log(error);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const email = req.session.email;
      const { name } = req.body;
      await User.updateMany({ email: email }, { name: name });
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  },
  //User logout
  logOut: async (req, res) => {
    try {
      req.session.logged = false;
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  },
};
