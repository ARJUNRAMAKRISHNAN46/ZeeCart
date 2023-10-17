const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const Products = require("../models/productModel");
const { sendOTP } = require("../util/otp");
var e_mail;
var n_ame;
var s_tatuz;
var p_assword;
module.exports = {
  // Logged: async (req, res) => {
  //   try {
  //     const { email, password } = req.body;
  //     e_mail = email;
  //     const data = await User.findOne({ email });
  //     const imgs = await Products.find(); //fetching product images from database
  //     if (req.session.emai) {
  //       res.redirect("/");
  //     } else {
  //       //comparing passwords
  //       // const pass = await bcrypt.compare(password, data.password);
  //       if (data.email == email && data.password == password) {
  //         //compare entered password,email and password,email in db
  //         if (data.statuz == "Active") {
  //           req.session.logged = true;
  //           req.session.email = email;
  //           res.redirect("/");
  //         } else {
  //           res.redirect("/access-denied");
  //         }
  //       } else {
  //         res.redirect("/invalid-user");
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  
  // sendOTPController: async (req, res) => {
  //   try {
  //     const { statuz, name, email, password } = req.body;
  //     // console.log(statuz, name, email, password); //fetching user data from database
  //     const data = await User.findOne({ email });

  //     if (data) {
  //       res.render("user/signup", { err: "email already exists" });
  //     } else {
  //       //sending otp to the entered email
  //       e_mail = email;
  //       n_ame = name;
  //       s_tatuz = statuz;
  //       p_assword = password;
  //       await sendOTP(email);
  //       setTimeout(async () => {
  //         await OTP.deleteOne({ email: email });
  //       }, 30000);
  //       res.render("user/otp", {
  //         err: "",
  //         email: email,
  //         statuz,
  //         name: name,
  //         password,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  resendOtp: async (req, res) => {
    try {
      const { statuz, name, email, password } = req.body;
      const data = await User.findOne({ e_mail });
      sendOTP(e_mail);

      res.render("user/otp", {
        err: "",
        email: e_mail,
        statuz: s_tatuz,
        name: n_ame,
        password: p_assword,
      });
    } catch (error) {
      console.log(error);
    }
  },
  
  
  
  // signUp: async (req, res) => {
  //   try {
  //     const arr = [];
  //     arr.push(req.body.num1);
  //     arr.push(req.body.num2);
  //     arr.push(req.body.num3);
  //     arr.push(req.body.num4);
  //     taking the user entered otp
  //     const otpNumber = arr.map(Number);
  //     const finalotp = Number(arr.join(""));
  //     console.log(finalotp + "ghj");
  //     const { email, name, password, statuz } = req.body;

  //     const userOTP = await OTP.find({ email });

  //     comparing the entered otp and and sending otp
  //     if (userOTP[0].otp == finalotp) {
  //       req.session.email = email;
  //       req.session.logged = true;
  //       const usedata = await User.create({
  //         email: email,
  //         statuz: statuz,
  //         name: name,
  //         password: password,
  //       });

  //       res.redirect("/");
  //     } else {
  //       res.render("user/otp", {
  //         err: "Invalid otp",
  //         email,
  //         name,
  //         statuz,
  //         password,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  // getLogin: async (req, res) => {
  //   try {
  //     const email = req.session.email;
  //     const data = await User.findOne({ email });
  //     const imgs = await Products.find();
  //     if (req.session.email) {
  //       res.redirect("/");
  //     } else {
  //       res.render("user/login", { err: "" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  //log out section
  // logOut: async (req, res) => {
  //   try {
  //     req.session.destroy();
  //     res.redirect("/");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};
