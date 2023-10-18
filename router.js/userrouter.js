const express = require("express");
const router = express.Router();
const passport = require("passport");
const { verifySignup } = require("../middleware/session.js");
const {
  productSpec,
  productList,
  Cart,
  addToCart,
} = require("../controllers/productController");
const {
  Profile,
  getAddAddress,
  addAddress,
} = require("../controllers/addressController");
const {
  getSignupOtp,
  postSignupOtp,
  // resendOtp,
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  throwErrOne,
  throwErrTwo,
  throwErrThree,
  logOut,
} = require("../controllers/controller");
const {
  host,
  wishList,
  Orders,
  forgotPassword,
  verifyEmail,
  comapareOtp,
  setPassword,
  search
} = require("../controllers/userController");

router.get("/", verifySignup, host);

router.route("/home", verifySignup).get(getLogin).post(postLogin);
router.route("/send-otp", verifySignup).get(getSignupOtp).post(postSignupOtp);
router.post("/signUp", postSignup);
router.get("/logout", verifySignup, logOut);
router.get('/getSignup',getSignup)
// router.post("/verifyemail", verifySignup, verifyEmail);
// router.post("/verifyOtp", verifySignup, comapareOtp);
// router.post("/setPassword", verifySignup, setPassword);
router.post("/addAddress", verifySignup, addAddress);
// router.get("/wishlist", verifySignup, wishList);
router.get("/profile", verifySignup, Profile);
router.get("/getAddAddress", verifySignup, getAddAddress);
// router.get("/productorders", verifySignup, Orders);
router.get("/cart", verifySignup, Cart);
router.get("/shop", verifySignup, productList);
router.get("/productspecs/:id", verifySignup, productSpec);
// router.get("/forgotpass", verifySignup, forgotPassword);
router.get("/access-denied", verifySignup, throwErrOne);
router.get("/invalid-user", verifySignup, throwErrTwo);
router.get("/invalid-otp", verifySignup, throwErrThree);
// router.get("/homepage", verifySignup, getLogin);
// router.get("/resendOtp", verifySignup, resendOtp);
router.post("/addToCart/:id", verifySignup, addToCart);
// router.post('/search',verifySignup,search);

module.exports = router;
