const express = require("express");
const routers = express.Router();
const controller = require("../controllers/admin-controller");
const UserSchema = require("../models/model");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./product-images");
  },
  filename: function (req, file, cb) {
    const randomeString = crypto.randomBytes(3).toString("hex");
    const timestamp = Date.now();
    const uniqueFile = `${timestamp}-${randomeString}`;
    cb(null, uniqueFile + ".png");
  },
});
const upload = multer({ storage: storage });
const uploadFields = [
  { name: "image1", maxCount: 1 },
  // { name: "image2", maxCount: 1 },
  // { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
  { name: "main", maxCount: 1 },

];

routers.get("/customers", controller.admin_Users);
routers.get("/brands", controller.admin_brands);
routers.get("/catagory", controller.admin_catagory);
routers.get("/products", controller.admin_product);
routers.post("/upload",controller.upload.fields('productImage1'),controller.product_upload);

module.exports = routers;
