const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  Logged,
  host,
  wishList,
  Profile,
  Orders,
  Cart,
  signUp,
  sendOTPController,
} = require("../controllers/controller");
const {
  userLogin,
  userSigntoLog,
} = require("../controllers/user-controller");

const UserSchema = require("../models/model");
const { render } = require("ejs");
const passport = require("passport");
const userOTPVerification = require("../models/otpverification");
const nodemailer = require("nodemailer");

const credential = {
  email: "abcd@gmail.com",
  password: 123,
};
router.get("/", host);
router.post("/logged", Logged);
router.post("/send-otp", sendOTPController);
router.route("/home").get(userSigntoLog).post(userLogin);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.render("user/newhome", {});
  }
);
router.get("/wishlist", wishList);
router.get("/profile", Profile);
router.get("/orders", Orders);
router.get("/cart", Cart);
router.post("/signed", signUp);

module.exports = router;
