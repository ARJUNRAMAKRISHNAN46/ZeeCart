const express = require("express");
const router = express.Router();
const passport = require("passport");
const { verifyUser, userExist } = require("../middleware/session.js");
const {errorMiddleware} = require('../middleware/error');
//requiring functions from productcontroller---------------------->
const {
  productSpec,
  productList,
  categoryList,
  memoryFilter
} = require("../controllers/productController");
//requiring functions from ordercontroller----------------------->
const {
  Orders,
  addToOrders,
  viewDetails,
  deleteOrderStatus,
  downloadInvoice
} = require("../controllers/orderController.js");
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
  addNewAddress,
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
  updateProfile,
  logOut,
} = require("../controllers/controller");
//requiring functions from cartcontroller-------------------------->
const {
  Cart,
  addToCart,
  demo,
  removeFromCart,
  updateQuantity,
  checkCoupon
} = require("../controllers/cartController.js");
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
  removeFromWishlist,
  guestPage,
  verifyPayment
} = require("../controllers/userController");
const {
  createOrder,
} = require('../controllers/paymentController.js');
const {
} = require('../controllers/couponController.js');
const upload = require("../middleware/multer");

//home route------------------------------------------------------->
router.get("/guest",userExist, guestPage);
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
router.get("/getAddAddress", verifyUser, getAddAddress,errorMiddleware);
router.post("/addAddress", verifyUser,addAddress);
router.get("/geteditAddress/:id", verifyUser, getEditAddress,errorMiddleware);
router.post("/postEditAddress", verifyUser, postEditAddress,errorMiddleware);
router.get("/deleteAddress/:id", verifyUser, deleteAddress,errorMiddleware);
router.get('/addAddress',verifyUser,addAddress)
router.post('/addNewAddress',verifyUser,addNewAddress)
//profile routes--------------------------------------------------->
router.get("/profile", verifyUser, Profile,errorMiddleware);
router.post('/updateProfile',verifyUser,updateProfile)
//cart routes------------------------------------------------------>
router.get("/cart", verifyUser, Cart,errorMiddleware);
router.post("/removefromcart", verifyUser, removeFromCart,errorMiddleware);
router.post("/addToCart/:id", verifyUser, demo,errorMiddleware);
router.post("/updatequantity", verifyUser, updateQuantity,errorMiddleware);
router.get("/placeOrder", verifyUser, placeOrder,errorMiddleware);
router.post("/confirmAddress", verifyUser, confirmAddress,errorMiddleware);
router.post('/makePayment/:id',createOrder)
// router.post('/confirmPayment',verifyUser,confirmPayment)
//shop route------------------------------------------------------->
router.get("/shop", verifyUser, productList,errorMiddleware);
router.get('/categoryFilter',verifyUser,categoryList);
router.get('/memoryFilter',verifyUser,memoryFilter)
//error routes----------------------------------------------------->
router.get("/access-denied", userExist, throwErrOne);
router.get("/invalid-user", userExist, throwErrTwo);
router.get("/invalid-otp", userExist, throwErrThree);
//product routes--------------------------------------------------->
router.get("/productspecs/:id", verifyUser, productSpec,errorMiddleware);
router.get("/productorders", verifyUser, Orders,errorMiddleware);
router.post("/addToOrders/:id", verifyUser, addToOrders,errorMiddleware);
router.put('/deleteOrderStatus/:id',verifyUser,deleteOrderStatus)
router.post('/downloadInvoice/:id',verifyUser,downloadInvoice)
router.post('/verify-payment',verifyPayment)
//wishlist route--------------------------------------------------->
router.get("/wishlist", verifyUser, wishList,errorMiddleware);
router.get("/addToWishlist/:id", verifyUser, addToWishlist,errorMiddleware);
router.post("/removeFromWishlist/:id", verifyUser, removeFromWishlist,errorMiddleware);
//forgot password route-------------------------------------------->
router.post("/verifyemail", verifyEmail,errorMiddleware);
router.post("/verifyOtp", comapareOtp,errorMiddleware);
router.post("/setPassword", setPassword,errorMiddleware);
router.get("/forgotpass", forgotPassword,errorMiddleware);
router.get("/resendOtp", userExist, resendOtp,errorMiddleware);
router.post("/search", verifyUser, search,errorMiddleware);
//coupon routes-------------------------------------------------->
router.post('/checkCoupon',verifyUser,checkCoupon);
//password routes-------------------------------------------------->
router.get("/changePassword", verifyUser, changePassword,errorMiddleware);
//logout route----------------------------------------------------->
router.get("/logout", verifyUser, logOut);

module.exports = router;
