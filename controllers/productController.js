const products = require("../models/productModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Brand = require("../models/brandModel");
const Category = require("../models/catagoryModel");
const Order = require("../models/ordersModel");
const { ObjectId } = require("mongodb");
const wishlist = require("../models/wishlistModel");
const offer = require("../models/offerModel");
const returnItem = require("../models/retunModel");
const Wallet = require("../models/walletModel");
const catPrice = require("../models/categoryPriceModel");

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
          images[i] = req.files[fieldname][0]?.filename;
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

  //-----------------------------------------user control (product blocking and unblocking)------------------------------------------
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
  //------------------------------------------------product details page--------------------------------------------------------
  productSpec: async (req, res) => {
    try {
      const prodId = req.params.id;
      const email = req.session.email;
      const userData = await User.findOne({ email: email });
      const userId = userData._id;
      const wishData = await wishlist.findOne({
        products: { $elemMatch: { productId: prodId } },
      });
      let status;
      if (wishData) {
        status = true;
      } else {
        status = false;
      }
      //fetching product details
      const prodSpec = await products.findById(prodId);
      let i = 0;
      res.render("user/newSpec", { prodSpec, i, status });
    } catch (error) {
      console.log(error);
    }
  },
  //-----------------------------------------------product list for user------------------------------------------------------------
  productList: async (req, res) => {
    try {
      const imgs = await products.find();
      res.render("user/shop", { imgs });
    } catch (error) {
      console.log(error);
    }
  },
  //-------------------------------------------------brand filtering------------------------------------------------------------------
  brandFilter: async (req, res) => {
    try {
      const brandData = req.query.brandData;
      const imgs = await products.find({ BrandName: brandData });
      res.render("user/shop", { imgs });
    } catch (error) {
      console.log(error);
    }
  },
  //-------------------------------------------------category filter------------------------------------------------------------------
  categoryFilter: async (req, res) => {
    try {
      const catData = req.query.catData;
      const imgs = await products.find({ Category: catData });
      res.render("user/shop", { imgs });
    } catch (error) {
      console.log(error);
    }
  },
  //-------------------------------------------------price sorting------------------------------------------------------------------
  priceSort: async (req, res) => {
    try {
      const sort = req.query.sort;
      let imgs = [];
      if (sort == "minus") {
        imgs = await products.find().sort({ DiscountAmount: 1 });
      } else {
        imgs = await products.find().sort({ DiscountAmount: -1 });
      }
      res.render("user/shop", { imgs });
    } catch (error) {
      console.log(error);
    }
  },
  //-------------------------------------------------price filtering----------------------------------------------------------------
  priceUnder: async (req, res) => {
    try {
      const level = req.query.type;
      let imgs = [];
      if (level == "ascending") {
        imgs = await products
          .find({ DiscountAmount: { $lte: 40000 } })
          .sort({ DiscountAmount: 1 });
      } else {
        imgs = await products
          .find({ DiscountAmount: { $gte: 40000 } })
          .sort({ DiscountAmount: 1 });
      }
      res.render("user/shop", { imgs });
    } catch (error) {
      console.log(error);
    }
  },
  //--------------------------------------------------offer management-------------------------------------------------------------
  addOffer: async (req, res) => {
    try {
      const data = req.body;
      const catagory = data.Catagory;
      const discount = data.discount;
      const expiryDate = req.body.expiryDate;

      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      if (expiryDate > formattedDate) {
        const proData = await products.updateMany(
          { Category: catagory },
          {
            $mul: { DiscountAmount: (100 - discount) / 100 },
          }
        );
      }

      const offers = await offer.create(req.body);

      res.redirect("/offers");
    } catch (error) {
      console.log(error);
    }
  },
  returnProduct: async (req, res) => {
    try {
      const orderId = req.params.id;
      const email = req.session.email;
      const reason = req.body.returnReason;
      const description = req.body.description;
      const userData = await User.findOne({ email });
      const userId = userData._id;
      const orderData = await Order.findOne({ _id: orderId });

      const amount = orderData.totalAmount;
      const retn = await returnItem.create({
        userId: userId,
        orderId: orderId,
        returnReason: reason,
        description: description,
      });

      const newStatus = "Requested";
      const data = await Order.findByIdAndUpdate(orderId, {
        orderStatus: newStatus,
      });
      res.redirect("/productorders");
    } catch (error) {
      console.log(error);
    }
  },
  deleteOffer: async (req, res) => {
    try {
      const couponId = req.params.id;
      const couponData = await offer.findByIdAndDelete(couponId);
      res.redirect("/offers");
    } catch (error) {
      console.log(error);
    }
  },
  editOffer: async (req, res) => {
    try {
      let couponId = req.params.id;
      const couponData = await offer.findOne({ _id: couponId });
      const catData = await Category.find();
      res.render("admin/editOffer", { couponData, catData });
    } catch (error) {
      console.log(error);
    }
  },
  postEditOffer: async (req, res) => {
    try {
      const offerData = await offer.updateOne({
        Catagory: req.body.Catagory,
        discount: req.body.discount,
        expiryDate: req.body.expiryDate,
      });
      res.redirect("/offers");
    } catch (error) {
      console.log(error);
    }
  },
  deleteSingleImage: async (req, res) => {
    try {
      const productId = req.params.id;
      const imageIndex = req.params.index;
      const product = await products.findById(productId);
      if (!product) {
        return res.status(404).send("Product not found");
      }
      const update = await products.updateOne(
        { _id: productId },
        { $pull: { images: imageIndex } }
      );
      res.json({
        success: true,
      });
    } catch (error) {
      console.error("Error while deleting the product image:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  addCategoryOffer: async (req, res) => {
    try {
      const { Catagory, discount, expiryDate } = req.body;
      const existingOffer = await offer.findOne({ Catagory: Catagory });
      if (existingOffer) {
        const catData = await Category.find();
        const offers = await offer.find();
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        res.render("admin/offerManagement", {
          catData,
          offers,
          formattedDate,
          err: "Offer Already Exists",
        });
      } else {
        const newOffer = await offer.create({
          Catagory: Catagory,
          discount: discount,
          expiryDate: expiryDate,
          Status: "Active",
        });

        const fetchCategoryId = await Category.findOne({
          catagoryName: Catagory,
        });

        if (!fetchCategoryId) {
          return res.status(404).json({ error: "Category not found" });
        }
        const categoryId = fetchCategoryId._id;
        const productsBeforeOffer = await products.find({
          catagoryName: Catagory,
        });

        for (const product of productsBeforeOffer) {
          const discountPrice = product.DiscountAmount;

          await products.updateOne(
            { _id: product._id },
            {
              $set: {
                beforeOffer: discountPrice,
                IsInCategoryOffer: true,
                categoryOffer: { offerPercentage: discount },
              },
            }
          );
        }
        const offerMultiplier = 1 - discount / 100;
        const productData = await products.updateMany(
          { Category: Catagory },
          {
            $mul: { DiscountAmount: offerMultiplier },
          }
        );
        res.redirect("/offers");
      }
      // res
      //   .status(201)
      //   .json({ success: true, message: "Category offer added successfully" });
    } catch (error) {
      console.error("Error while adding the category offer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
