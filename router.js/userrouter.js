const express = require("express");
const router = express.Router();
const passport = require("passport");
const CartCount = require("../middleware/helperFunction");
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
  WalletHistory,
  walletPayment,
  paymentComplete,
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
  getQuantity,
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
router.get("/", verifyUser, CartCount, host);
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
router.get("/geteditAddress/:id", verifyUser, CartCount, getEditAddress);
router.post("/postEditAddress", verifyUser, CartCount, postEditAddress);
router.get("/deleteAddress/:id", verifyUser, CartCount, deleteAddress);
router.get("/addAddress", verifyUser, CartCount, getAddAddress);
router.post("/addAddress", verifyUser, CartCount, addAddress);
router.post("/addNewAddress", verifyUser, CartCount, addNewAddress);
router.get("/getAddUserAddress", verifyUser, CartCount, getAddUserAddress);
//profile routes--------------------------------------------------->
router.get("/profile", verifyUser, CartCount, Profile);
router.post("/updateProfile", verifyUser, CartCount, updateProfile);
router.get("/myCoupons", verifyUser, CartCount, userCoupons);
router.get("/walletHystory", verifyUser, CartCount, WalletHistory);
//cart routes------------------------------------------------------>
router.get("/cart", verifyUser, CartCount, Cart);
router.post("/removefromcart", verifyUser, CartCount, removeFromCart);
router.post("/addToCart/:id", verifyUser, CartCount, addToCart);
router.post("/updatequantity", verifyUser, CartCount, updateQuantity);
router.get("/placeOrder", verifyUser, CartCount, placeOrder);
router.post("/confirmAddress", verifyUser, CartCount, cashOnDelivery);
router.post("/makePayment", verifyUser, CartCount, createOrder);
router.get("/paymentComplete", verifyUser, paymentComplete);
router.get("/walletPayment/:id", verifyUser, CartCount, walletPayment);
router.get("/getcartquantity", verifyUser, CartCount, getQuantity);
// router.post('/confirmPayment',verifyUser,confirmPayment)
//shop route------------------------------------------------------->
router.get("/shop", verifyUser, CartCount, productList);
router.get("/brandFilter", verifyUser, CartCount, brandFilter);
router.get("/categoryFilter", verifyUser, CartCount, categoryFilter);
router.get("/priceSort", verifyUser, CartCount, priceSort);
router.get("/priceAboveFourty", verifyUser, CartCount, priceUnder);
//error routes----------------------------------------------------->
router.get("/access-denied", userExist, CartCount, throwErrOne);
router.get("/invalid-user", userExist, CartCount, throwErrTwo);
router.get("/invalid-otp", userExist, CartCount, throwErrThree);
//product routes--------------------------------------------------->
router.get("/productspecs/:id", verifyUser, CartCount, productSpec);
router.get("/productorders", verifyUser, CartCount, Orders);
router.post("/addToOrders/:id", verifyUser, CartCount, addToOrders);
router.put("/deleteOrderStatus/:id", verifyUser, CartCount, deleteOrderStatus);
router.post("/downloadInvoice/:id", verifyUser, CartCount, downloadInvoice);
router.post("/verify-payment", verifyUser, CartCount, verifyPayment);
router.post("/returnItem/:id", verifyUser, CartCount, returnProduct);
//wishlist route--------------------------------------------------->
router.get("/wishlist", verifyUser, CartCount, wishList);
router.get("/addToWishlist/:id", verifyUser, CartCount, addToWishlist);
router.post(
  "/removeFromWishlist/:id",
  verifyUser,
  CartCount,
  removeFromWishlist
);
//forgot password route-------------------------------------------->
router.post("/verifyemail", CartCount, verifyEmail);
router.post("/verifyOtp", CartCount, comapareOtp);
router.post("/setPassword", CartCount, setPassword);
router.get("/forgotpass", CartCount, forgotPassword);
router.get("/resendOtp", CartCount, userExist, resendOtp);
router.post("/search", CartCount, verifyUser, search);
//coupon routes-------------------------------------------------->
router.post("/checkCoupon", verifyUser, CartCount, checkCoupon);
//password routes-------------------------------------------------->
router.get("/changePassword", verifyUser, CartCount, changePassword);
//logout route----------------------------------------------------->
router.get("/logout", verifyUser, logOut);

module.exports = router;
