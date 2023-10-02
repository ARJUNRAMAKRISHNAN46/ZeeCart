const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  userLogin,
  userSignup,
  userLogtoSign,
  userSigntoLog,
  sendOTPController,
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
router.get("/", (req, res) => {
  if (req.session.userlogged) {
    res.render("users/home");
  } else {
    res.render("user/login", { title: "user login page" });
  }
});

router.post("/send-otp", sendOTPController);

router.route("/home").get(userSigntoLog).post(userLogin);
router.route("/signup").get(userLogtoSign).post(userSignup);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.render("user/home", {});
  }
);

module.exports = router;
