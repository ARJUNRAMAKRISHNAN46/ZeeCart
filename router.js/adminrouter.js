const express = require("express");
const routers = express.Router();
const controller = require("../controllers/admin-controller");
const UserSchema = require("../models/model");
const multer = require("multer");
const upload = require("../middleware/multer");

routers.get("/customers", controller.admin_Users);
routers.get("/brands", controller.admin_brands);
routers.get("/catagory", controller.admin_catagory);
routers.get("/products", controller.admin_product);
routers.post("/addproduct", upload.single("images"), controller.AddProduct);

module.exports = routers;
