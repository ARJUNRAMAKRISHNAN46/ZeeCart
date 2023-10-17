const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const Products = require("../models/productModel");
const { sendOTP } = require("../util/otp");

var _email;
var _name;
var _statuz;
var _password;

module.exports = {
  getLogin: async (req, res) => {
    try {
      res.render("user/login");
    } catch (error) {}
  },
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      _email = email;
      _password = password;
      const userData = await User.findOne({ email });
      const products = await Products.find();

      if (userData.email == email && userData.password == password) {
        if (data.statuz == "Active") {
          req.session.logged = true;
          req.session.email = email;
          res.redirect("/home");
        } else {
          res.redirect("/access-denied");
        }
      } else {
        res.redirect("/invalid-user");
      }
    } catch (error) {
      console.log("an error occured in line userlogin");
    }
  },
  throwErrOne: async (req, res) => {
    //throwing an error when the user was blocked by admin
    try {
      res.render("user/login", { err: "your access is denied by the admin" });
    } catch (error) {
      console.log(error);
    }
  },
  throwErrTwo: async (req, res) => {
    try {
      res.render("user/login", { err: "invalid username or password" });
    } catch (error) {
      console.log(error);
    }
  },
  getSignupOtp: async (req, res) => {
    try {
      let email = _email;
      const data = await User.findOne({ email }); //searching for email if it is already registered or not
      const imgs = await Products.find();
      res.render("user/signup", { err: "" });
    } catch (error) {
      console.log(error);
    }
  },
  signupOtp: async (req, res) => {
    try {
      const { statuz, name, email, password } = req.body;
      const data = await User.findOne({ email });
      if (data) {
        res.redirect("user/invalid-email");
      } else {
        _email = email;
        _name = name;
        _statuz = statuz;
        _password = password;

        await sendOTP(email);

        setTimeout(async () => {
          await OTP.deleteOne({ email: email });
        }, 30000);
        req.redirect("/getOtp");
      }
    } catch (error) {
      console.log("an error occured in line signupotp");
    }
  },
  userSignup: async (req, res) => {
    try {
      const arr = [];
      arr.push(req.body.num1);
      arr.push(req.body.num2);
      arr.push(req.body.num3);
      arr.push(req.body.num4);
      const otpNumber = arr.map(Number);
      const finalotp = Number(arr.join(""));
      const { email, name, password, statuz } = req.body;
      const userOTP = await OTP.find({ email });
      if (userOTP[0].otp == finalotp) {
        req.session.logged = true;
        req.session.email = email;
        const usedata = await User.create({
          email: email,
          statuz: statuz,
          name: name,
          password: password,
        });
        res.redirect("/home");
      } else {
        res.redirect("/invalid-otp");
      }
    } catch (error) {
      console.log("an error occured in line signup");
    }
  },
  //------------------------Throwing an error--------------------------
  throwErrThree: (req, res) => {
    try {
      const email = req.body.email;
      res.render("user/otp", { err: "Email ID already exists", email });
    } catch (error) {
      console.log(error);
    }
  },
  //------------------------ User logout--------------------------
  logOut: async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  },
};
