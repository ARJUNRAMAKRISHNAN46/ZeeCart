const express = require("express");
const routers = express.Router();
const { verifyAdmin, adminExist, verifyUser } = require("../middleware/session");
const { admin_coupon, addCoupon } = require("../controllers/couponController");
const {
  adHost,
  admin_Login,
  admin_dash,
  admin_admin,
  admin_banners,
  admin_payments,
  adminLogOut,
} = require("../controllers/admin-controller");
const { admin_Users, user_Blocking } = require("../controllers/userController");
const {
  admin_orders,
  updateOrderStatus,
  viewDetails,
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
} = require("../controllers/productController");
const upload = require("../middleware/multer");
//<--------------Catagory---------------->
routers.get("/catagory", verifyAdmin, admin_catagory);
routers.get("/getcatagory", verifyAdmin, getCategory);
routers.post("/uploadcatagory", verifyAdmin, uploadCatagory);
routers.post("/addcatagory", verifyAdmin, addCategory);
routers.get("/editcatagory/:id", verifyAdmin, editCatagory);
routers.get("/deletecatagory/:id", verifyAdmin, deleteCatagory);
//<----------------Offer------------------>
routers.post('/addOffer',verifyAdmin,addOffer);
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
//<-----------------Orders------------------>
routers.get("/orders", verifyAdmin, admin_orders);
routers.put("/updateOrderStatus/:id", verifyAdmin, updateOrderStatus);
routers.get("/viewDetails/:id", verifyAdmin, viewDetails);
//<-----------------Users------------------>
routers.get("/customers", verifyAdmin, admin_Users);
routers.post("/block/:id", verifyAdmin, user_Blocking);

routers.get("/adminpanel", adminExist, adHost);
routers.post("/adminlogin", adminExist, admin_Login);
routers.get("/dashboard", verifyAdmin, admin_dash);
routers.get("/banners", verifyAdmin, admin_banners);
routers.get("/offers", verifyAdmin, admin_payments);
routers.get("/admin", verifyAdmin, admin_admin);

routers.get("/coupon", verifyAdmin, admin_coupon);
routers.post("/addCoupon", verifyAdmin, addCoupon);

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

module.exports = routers;
