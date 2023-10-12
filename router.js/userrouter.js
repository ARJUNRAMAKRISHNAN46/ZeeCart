const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/model");
const UserSchema = require("../models/model");
const { render } = require("ejs");
const passport = require("passport");
const userOTPVerification = require("../models/otpverification");
const nodemailer = require("nodemailer");
const {
  Logged,
  host,
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
} = require("../controllers/controller");

router.get("/", host);
router.route("/home").get(getLogin).post(Logged);
router.route("/send-otp").get(getOpt).post(sendOTPController);
router.get("/wishlist", wishList);
router.get("/profile", Profile);
router.get("/productorders", Orders);
router.get("/cart", Cart);
router.get('/shop',productList)
router.post("/signed", signUp);
router.get("/productspecs/:id", productSpec);
router.get("/logout", logOut);
router.get("/forgotpass", forgotPassword);
router.post("/verifyemail", verifyEmail);
router.post("/verifyotp", comapareOtp);
router.post('/setpassword',setPassword);
router.get('/access-denied',throwErrOne);
router.get('/invalid-user',throwErrTwo);
router.get('/invalid-otp',throwErrThree);
router.get('/homepage',getLogin)

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    console.log();
    const imgs = await User.productuploads.find();
    // const data = await User.Users.find();
    const data = "user";
    res.render("user/home", { imgs, data });
  }
);

module.exports = router;
