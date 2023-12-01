const express = require("express");
const routers = express.Router();
const upload = require("../middleware/multer");
const bannerMulter = require('../middleware/bannerMulter');
const { admin_banners,addBanner,deleteBanner } = require("../controllers/bannerController");
const { admin_coupon, addCoupon } = require("../controllers/couponController");
const { admin_Users, user_Blocking } = require("../controllers/userController");
const {
  verifyAdmin,
  adminExist,
  verifyUser,
} = require("../middleware/session");
const {
  admin_dash,
  getCount,
  getSalesOrder,
} = require("../controllers/dashboardController");
const {
  adHost,
  admin_Login,
  admin_admin,
  admin_offers,
  adminLogOut,
} = require("../controllers/admin-controller");
const {
  admin_orders,
  updateOrderStatus,
  viewDetails,
  getDownloadSalesReport,
  returnRequest,
  rejectReturn,
  acceptReturn,
  generateOrderInvoice,
} = require("../controllers/orderController");
const {
  admin_catagory,
  getCategory,
  uploadCatagory,
  addCategory,
  editCatagory,
  deleteCatagory,
} = require("../controllers/catagoryController");
const {
  addBrand,
  admin_brands,
  brandAdded,
  deleteBrand,
  editBrand,
  uploadBrand,
} = require("../controllers/brandController");
const {
  admin_product,
  getAddProduct,
  product_Blocking,
  addProduct,
  editProduct,
  getEditProduct,
  addOffer,
  deleteOffer,
  editOffer,
  postEditOffer,
  deleteSingleImage,
  addCategoryOffer,
} = require("../controllers/productController");

//<--------------Catagory---------------->
routers.get("/catagory", verifyAdmin, admin_catagory);
routers.get("/getcatagory", verifyAdmin, getCategory);
routers.post("/uploadcatagory", verifyAdmin, uploadCatagory);
routers.post("/addcatagory", verifyAdmin, addCategory);
routers.get("/editcatagory/:id", verifyAdmin, editCatagory);
routers.get("/deletecatagory/:id", verifyAdmin, deleteCatagory);

//<----------------Offer------------------>
routers.get("/offers", verifyAdmin, admin_offers);
routers.post("/addOffer", verifyAdmin, addCategoryOffer);
routers.get("/deleteOffer/:id", verifyAdmin, deleteOffer);
routers.get("/editOffer/:id", verifyAdmin, editOffer);
routers.post("/postEditOffer", verifyAdmin, postEditOffer);

//<----------------Brand------------------>
routers.get("/addbrand", verifyAdmin, addBrand);
routers.get("/brands", verifyAdmin, admin_brands);
routers.post("/brandadded", verifyAdmin, brandAdded);
routers.get("/deletebrand/:id", verifyAdmin, deleteBrand);
routers.get("/editbrand/:id", verifyAdmin, editBrand);
routers.post("/uploadbrand", verifyAdmin, uploadBrand);

//<---------------Product----------------->
routers.get("/products", verifyAdmin, admin_product);
routers.get("/getproduct", verifyAdmin, getAddProduct);
routers.get("/blockproduct/:id", verifyAdmin, product_Blocking);
routers.get("/editProduct/:id", verifyAdmin, getEditProduct);
routers.get('/deleteSingleImage/:id/:index',verifyAdmin,deleteSingleImage);

//<-----------------Orders------------------>
routers.get("/orders", verifyAdmin, admin_orders);
routers.put("/updateOrderStatus/:id", verifyAdmin, updateOrderStatus);
routers.get("/viewDetails/:id", verifyAdmin, viewDetails);
routers.get('/returnRequest/:id',verifyAdmin,returnRequest);
routers.get('/acceptReturn/:id',verifyAdmin,acceptReturn);
routers.get('/rejectReturn/:id',verifyAdmin,rejectReturn);

//<-----------------Users------------------>
routers.get("/customers", verifyAdmin, admin_Users);
routers.post("/block/:id", verifyAdmin, user_Blocking);

//<-----------------Admin------------------>
routers.get("/adminpanel", adminExist, adHost);
routers.post("/adminlogin", adminExist, admin_Login);

//<-----------------dashboard------------------>
routers.get("/dashboard", verifyAdmin, admin_dash);
routers.get("/count-orders-by-day", verifyAdmin, getCount);
routers.get("/count-orders-by-month", verifyAdmin, getCount);
routers.get("/count-orders-by-year", verifyAdmin, getCount);
routers.get("/latestOrders", verifyAdmin, getSalesOrder);
routers.get("/downloadSalesReport", verifyAdmin, getDownloadSalesReport);
routers.get("/admin", verifyAdmin, admin_admin);
routers.post('/downloadSalesReport',verifyAdmin,generateOrderInvoice)

//<-----------------Coupon------------------>
routers.get("/coupon", verifyAdmin, admin_coupon);
routers.post("/addCoupon", verifyAdmin, addCoupon);

//<-----------------Logout------------------>
routers.get("/log-out", adminLogOut);

// <-------------Image upload-------------->
const uploadFields = [
  { name: "main", maxCount: 1 },
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
];
routers.post("/addproduct", upload.fields(uploadFields), addProduct);
routers.post("/editedproduct/:id", upload.fields(uploadFields), editProduct);

//<-----------------banner------------------>
routers.get("/banners", verifyAdmin, admin_banners);
routers.post('/addBanner',verifyAdmin,bannerMulter.single('image'), addBanner);
routers.get('/deleteBanner',verifyAdmin,deleteBanner)

module.exports = routers;
