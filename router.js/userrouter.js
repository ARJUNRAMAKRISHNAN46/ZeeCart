const express = require("express");
const router = express.Router();
const passport = require("passport");
const { verifyUser, userExist } = require("../middleware/session.js");
//requiring functions from productcontroller---------------------->
const {
  productSpec,
  productList,
  Cart,
  addToCart,
  demo,
  removeFromCart,
  updateQuantity,
  
} = require("../controllers/productController");
//requiring functions from ordercontroller----------------------->
const {
  Orders,
  addToOrders,
  viewDetails
} = require('../controllers/orderController.js')
//requiring functions from addresscontroller----------------------->
const {
  Profile,
  getAddAddress,
  addAddress,
  getEditAddress,
  postEditAddress,
  deleteAddress,
  placeOrder,
  confirmAddress,
  // confirmPayment
} = require("../controllers/addressController");
//requiring functions from controller------------------------------>
const {
  getSignupOtp,
  postSignupOtp,
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  throwErrOne,
  throwErrTwo,
  throwErrThree,
  resendOtp,
  logOut,
} = require("../controllers/controller");
//requiring functions from usercontroller-------------------------->
const {
  host,
  wishList,
  forgotPassword,
  verifyEmail,
  comapareOtp,
  setPassword,
  search,
  addToWishlist,
  changePassword,
  removeFromWishlist
} = require("../controllers/userController");
//home route------------------------------------------------------->
router.get("/", verifyUser, host);
//login routes----------------------------------------------------->
router.get("/login", userExist, getLogin);
router.post("/login", postLogin);
//signup otp routes------------------------------------------------>
router.get("/send-otp", userExist, getSignupOtp);
router.post("/send-otp", postSignupOtp);
//signup routes---------------------------------------------------->
router.get("/getSignup", userExist, getSignup);
router.post("/signUp", postSignup);
//address routes--------------------------------------------------->
router.get("/getAddAddress", verifyUser, getAddAddress);
router.post("/addAddress", addAddress);
router.get("/geteditAddress/:id", verifyUser, getEditAddress);
router.post("/postEditAddress", verifyUser, postEditAddress);
router.get("/deleteAddress/:id", verifyUser, deleteAddress);
//profile routes--------------------------------------------------->
router.get("/profile", verifyUser, Profile);
//cart routes------------------------------------------------------>
router.get("/cart", verifyUser, Cart);
router.post("/removefromcart", verifyUser, removeFromCart);
router.post("/addToCart/:id", verifyUser, addToCart);
router.post("/updatequantity", verifyUser, updateQuantity);
router.get("/placeOrder", verifyUser, placeOrder);
router.post('/confirmAddress',verifyUser,confirmAddress)
// router.post('/confirmPayment',verifyUser,confirmPayment)
//shop route------------------------------------------------------->
router.get("/shop", verifyUser, productList);
//error routes----------------------------------------------------->
router.get("/access-denied", userExist, throwErrOne);
router.get("/invalid-user", userExist, throwErrTwo);
router.get("/invalid-otp", userExist, throwErrThree);
//product routes--------------------------------------------------->
router.get("/productspecs/:id", verifyUser, productSpec);
router.get("/productorders", verifyUser, Orders);
router.post('/addToOrders',verifyUser,addToOrders)
router.get('/viewdetails/:id',verifyUser,viewDetails)
//wishlist route--------------------------------------------------->
router.get("/wishlist", verifyUser, wishList);
router.get("/addToWishlist/:id", verifyUser, addToWishlist);
router.post('/removeFromWishlist/:id',verifyUser,removeFromWishlist);
//forgot password route-------------------------------------------->
router.post("/verifyemail", verifyEmail);
router.post("/verifyOtp", comapareOtp);
router.post("/setPassword", setPassword);
router.get("/forgotpass",forgotPassword);
router.get("/resendOtp", userExist, resendOtp);
router.post("/search", verifyUser, search);
//password routes-------------------------------------------------->
router.get('/changePassword',verifyUser,changePassword);
//logout route----------------------------------------------------->
router.get("/logout", verifyUser, logOut);

module.exports = router;