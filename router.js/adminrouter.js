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
  AddProduct
} = require("../controllers/admin-controller");
const UserSchema = require("../models/model");
const multer = require("multer");
const upload = require("../middleware/multer");

routers.get('/adminpanel',adHost);
routers.post('/adminlogin',admin_Login);
routers.get('/addproduct',getAddProduct);
routers.get("/customers",admin_Users);
routers.get("/brands",admin_brands);
routers.get("/catagory",admin_catagory);
routers.get("/products",admin_product);
routers.get('/block/:id',user_Blocking)
const uploadFields = [
    { name: "main", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ];
routers.post("/addproduct", upload.fields(uploadFields),AddProduct);

module.exports = routers;
