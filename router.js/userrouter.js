const express = require("express");
const router = express.Router();
const passport = require("passport");
const { verifyUser, userExist } = require("../middleware/session.js");
const { errorMiddleware } = require("../middleware/error");
const { userCoupons } = require("../controllers/couponController.js");
//requiring functions from productcontroller---------------------->
const {
  productSpec,
  productList,
  brandFilter,
  categoryFilter,
  priceSort,
  priceUnder,
  returnProduct,
} = require("../controllers/productController");
//requiring functions from ordercontroller----------------------->
const {
  Orders,
  addToOrders,
  viewDetails,
  deleteOrderStatus,
  downloadInvoice,
  cashOnDelivery,
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
  addNewAddress,
  getAddUserAddress,
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
  removeFromCart,
  updateQuantity,
  checkCoupon,
} = require("../controllers/cartController.js");
const {
  wishList,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController.js");
//requiring functions from usercontroller-------------------------->
const {
  host,
  forgotPassword,
  verifyEmail,
  comapareOtp,
  setPassword,
  search,
  changePassword,
  guestPage,
  verifyPayment,
} = require("../controllers/userController");
const { createOrder } = require("../controllers/paymentController.js");
const {} = require("../controllers/couponController.js");
const upload = require("../middleware/multer");

//home route------------------------------------------------------->
router.get("/guest", userExist, guestPage);
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
router.post("/addAddress", verifyUser, addAddress);
router.get("/geteditAddress/:id", verifyUser, getEditAddress);
router.post("/postEditAddress", verifyUser, postEditAddress);
router.get("/deleteAddress/:id", verifyUser, deleteAddress);
router.get("/addAddress", verifyUser, addAddress);
router.post("/addNewAddress", verifyUser, addNewAddress);
//profile routes--------------------------------------------------->
router.get("/profile", verifyUser, Profile);
router.post("/updateProfile", verifyUser, updateProfile);
router.get("/myCoupons", verifyUser, userCoupons);
router.get('/getAddUserAddress',verifyUser,getAddUserAddress);
//cart routes------------------------------------------------------>
router.get("/cart", verifyUser, Cart);
router.post("/removefromcart", verifyUser, removeFromCart);
router.post("/addToCart/:id", verifyUser, addToCart);
router.post("/updatequantity", verifyUser, updateQuantity);
router.get("/placeOrder", verifyUser, placeOrder);
router.post("/confirmAddress", verifyUser, cashOnDelivery);
router.post("/makePayment", verifyUser, createOrder);
// router.post('/confirmPayment',verifyUser,confirmPayment)
//shop route------------------------------------------------------->
router.get("/shop", verifyUser, productList);
router.get("/brandFilter", verifyUser, brandFilter);
router.get("/categoryFilter", verifyUser, categoryFilter);
router.get("/priceSort", verifyUser, priceSort);
router.get("/priceAboveFourty", verifyUser, priceUnder);
//error routes----------------------------------------------------->
router.get("/access-denied", userExist, throwErrOne);
router.get("/invalid-user", userExist, throwErrTwo);
router.get("/invalid-otp", userExist, throwErrThree);
//product routes--------------------------------------------------->
router.get("/productspecs/:id", verifyUser, productSpec);
router.get("/productorders", verifyUser, Orders);
router.post("/addToOrders/:id", verifyUser, addToOrders);
router.put("/deleteOrderStatus/:id", verifyUser, deleteOrderStatus);
router.post("/downloadInvoice/:id", verifyUser, downloadInvoice);
router.post("/verify-payment", verifyUser, verifyPayment);
router.post('/returnItem/:id',verifyUser,returnProduct);
//wishlist route--------------------------------------------------->
router.get("/wishlist", verifyUser, wishList);
router.get("/addToWishlist/:id", verifyUser, addToWishlist);
router.post("/removeFromWishlist/:id", verifyUser, removeFromWishlist);
//forgot password route-------------------------------------------->
router.post("/verifyemail", verifyEmail);
router.post("/verifyOtp", comapareOtp);
router.post("/setPassword", setPassword);
router.get("/forgotpass", forgotPassword);
router.get("/resendOtp", userExist, resendOtp);
router.post("/search", verifyUser, search);
//coupon routes-------------------------------------------------->
router.post("/checkCoupon", verifyUser, checkCoupon);
//password routes-------------------------------------------------->
router.get("/changePassword", verifyUser, changePassword);
//logout route----------------------------------------------------->
router.get("/logout", verifyUser, logOut);

module.exports = router;
