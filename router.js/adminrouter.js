const express = require("express");
const routers = express.Router();
const {
  adHost,
  admin_Login,
  getAddProduct,
  admin_Users,
  admin_brands,
  admin_catagory,
  admin_product,
  user_Blocking,
  AddProduct,
  addBrand,
  brandAdded,
  deleteBrand,
  editBrand,
  uploadBrand,
  admin_dash,
  admin_admin,
  admin_banners,
  admin_coupon,
  admin_orders,
  admin_payments,
  addCategory,
  getCategory,
  uploadCatagory,
  editCatagory,
  deleteCatagory
} = require("../controllers/admin-controller");
const UserSchema = require("../models/model");
const multer = require("multer");
const upload = require("../middleware/multer");

//<--------------Catagory---------------->
routers.get("/catagory",admin_catagory);
routers.get('/getcatagory',getCategory);
routers.post('/uploadcatagory',uploadCatagory);
routers.post('/addcatagory',addCategory);
routers.get('/editcatagory/:id',editCatagory);
routers.get('/deletecatagory/:id',deleteCatagory);
//<----------------Brand------------------>
routers.get('/addbrand',addBrand);
routers.get("/brands",admin_brands);
routers.post('/brandadded',brandAdded);
routers.get('/deletebrand/:id',deleteBrand);
routers.get('/editbrand/:id',editBrand);
routers.post('/uploadbrand',uploadBrand);
//<---------------Product----------------->
routers.get("/products",admin_product);
routers.get('/addproduct',getAddProduct);

//<-----------------Users------------------>
routers.get("/customers",admin_Users);
routers.get('/block/:id',user_Blocking);

routers.get('/adminpanel',adHost);
routers.post('/adminlogin',admin_Login);
routers.get("/dashboard",admin_dash);
routers.get('/banners',admin_banners);
routers.get('/orders',admin_orders);
routers.get('/payments',admin_payments);
routers.get('/admin',admin_admin);
routers.get('/coupon',admin_coupon);
// <-------------Image upload-------------->
const uploadFields = [
    { name: "main", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 }, 
    { name: "image3", maxCount: 1 },
  ];
routers.post("/addproduct", upload.fields(uploadFields),AddProduct);

module.exports = routers;
