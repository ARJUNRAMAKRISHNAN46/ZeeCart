const products = require("../models/productModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Brand = require("../models/brandModel");
const Category = require("../models/catagoryModel");
const Order = require("../models/ordersModel");
const { ObjectId } = require("mongodb");
let grandTotal;
module.exports = {
  admin_product: async (req, res) => {
    try {
      //creating pagination
      const pageNum = req.query.page;
      const perPage = 5;
      const dataCount = await products.find().count();
      const productDetails = await products
        .find()
        .skip((pageNum - 1) * perPage)
        .limit(perPage);
      const i = (pageNum - 1) * perPage;

      res.render("admin/products", { productDetails, i, dataCount });
    } catch (error) {
      console.log(error);
    }
  },
  // <---------------------------------------------------------------------------------------------------------->
  product_upload: async (req, res) => {
    try {
      res.render("admin/addProducts");
    } catch (error) {
      console.log(error);
    }
  },

  // -----------------------------------------------Get addProduct-----------------------------------------------------------

  getAddProduct: async (req, res) => {
    try {
      const category = await Category.find();
      const brands = await Brand.find();
      res.render("admin/addProduct", { brands, category });
    } catch (error) {
      console.log(error);
    }
  },

  // -----------------------------------------------Post addProduct-----------------------------------------------------------

  addProduct: async (req, res) => {
    try {
      const productDetails = req.body;
      console.log(productDetails);
      const files = req?.files;
      let ret = [
        files.main[0].filename,
        files.image1[0].filename,
        files.image2[0].filename,
        files.image3[0].filename,
      ];
      const uploaded = await products.create({
        ...productDetails,
        images: ret,
      });
      if (uploaded) {
        res.redirect("/products");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // -----------------------------------------------Post editProduct-----------------------------------------------------------

  getEditProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const product = await products.findOne({ _id: id });
      res.render("admin/editproduct", { product });
    } catch (error) {
      console.log(error);
    }
  },

  // -----------------------------------------------Get editProduct-----------------------------------------------------------

  editProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const files = req?.files;
      const images = [];
      const exisitngProduct = await products.findById(id);
      if (exisitngProduct) {
        images.push(...exisitngProduct.images);
      }
      for (i = 0; i < 4; i++) {
        const fieldname = `image${i + 1}`;
        if (req.files[fieldname] && req.files[fieldname][0]) {
          images[i] = req.files[fieldname][0];
        }
      }
      req.body.image = images;

      const productDetails = req.body;
      // let ret = [
      //   files.main[0].filename,
      //   files.image1[0].filename,
      //   files.image2[0].filename,
      //   files.image3[0].filename,
      // ];
      const uploaded = await products.updateOne(
        { _id: id },
        {
          ...productDetails,
          images,
        }
      );
      if (uploaded) {
        res.redirect("/products");
      }
    } catch (error) {
      console.log("An Error happened");
      throw error;
    }
  },

  //user control (product blocking and unblocking)
  product_Blocking: async (req, res) => {
    try {
      const id = req.params.id;
      const blockData = await products.findOne({ _id: id });
      if (blockData.status == "Active") {
        const blocked = await products.updateOne(
          { _id: id },
          { status: "blocked" }
        );
      } else if (blockData.status == "blocked") {
        const blocked = await products.updateOne(
          { _id: id },
          { status: "Active" }
        );
      }
      res.redirect("/products");
    } catch (error) {
      console.log(error);
    }
  },

  productSpec: async (req, res) => {
    try {
      const id = req.params.id;
      //fetching product details
      const prodSpec = await products.findById(id);
      let i = 0;
      res.render("user/newSpec", { prodSpec, i });
    } catch (error) {
      console.log(error);
    }
  },
  //product list for user
  productList: async (req, res) => {
    try {
      const imgs = await products.find();
      res.render("user/shop", { imgs });
    } catch (error) {
      console.log(error);
    }
  },
  categoryList: async (req, res) => {
    try {
      const catData = req.query.catData;
      console.log(catData);
      const imgs = await products.find({ BrandName: catData });
      console.log(imgs);
      res.render("user/shop", { imgs });
    } catch (error) {
      console.log(error);
    }
  },
  memoryFilter: async (req, res) => {
    try {
      
    } catch (error) {
      console.log(error);
    }
  },
};
