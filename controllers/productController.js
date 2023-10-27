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
      if (req.session.logged) {
        res.redirect("/dashboard");
      } else {
        //creating pagination
        const pageNum = req.query.page;
        const perPage = 10;
        const productDetails = await products
          .find()
          .skip((pageNum - 1) * perPage)
          .limit(perPage);
        const i = (pageNum - 1) * perPage;

        res.render("admin/products", { productDetails, i });
      }
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
      console.log("An Error happened");
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
      const productDetails = req.body;
      const id = req.params.id;
      const files = req?.files;
      let ret = [
        files.main[0].filename,
        files.image1[0].filename,
        files.image2[0].filename,
        files.image3[0].filename,
      ];
      const uploaded = await products.updateOne(
        { _id: id },
        {
          ...productDetails,
          images: ret,
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
  //getting cart page
  Cart: async (req, res) => {
    try {
      const data = await Cart.find();
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      // console.log(userId,"user id found");

      const cart = await Cart.findOne({ userId: userId }).populate(
        "products.productId"
      );
      if (cart) {
        const cartData = cart.products;

        let subtotal = 0;
        let totalQuantity = 0;

        cart.products.forEach((item) => {
          subtotal += item.quantity * item.productId.Price;
          totalQuantity += item.quantity;
        });

        const gstRate = 0.12;
        const gstAmount = subtotal * gstRate;
        const coupon = "";
        const total = subtotal + gstAmount;

        if (coupon) {
          const couponValue = 50;
          total -= couponValue;
        }
        grandTotal = total;
        res.render("user/cart", {
          user,
          product: cart.products,
          cart,
          subtotal: subtotal,
          gstAmount: gstAmount.toFixed(2),
          totalQuantity: totalQuantity,
          coupon: coupon,
          total: total,
        });
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  },
  //adding item to cart
  addToCart: async (req, res) => {
    try {
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      const productId = req.params.id;
      const userData = await Cart.findOne({ userId: userId });

      if (userData !== null) {
        const existingCart = userData.products.find((item) => {
          console.log(item.productId);
          item.productId.equals(productId);
        });
        if (existingCart) {
          existingCart.quantity += 1;
        } else {
          userData.products.push({ productId: productId, quantity: 1 });
        }
        await userData.save();
        req.flash("msg", "Item added to the cart");
        res.redirect("/cart");
      } else {
        const newCart = new Cart({
          userId: userId,
          products: [{ ProductId: productId, Quantity: 1 }],
        });
        await newCart.save();
        req.flash("msg", "Item added to the cart");
        res.redirect("/cart");
      }
    } catch (err) {
      console.log(err);
      req.flash("errmsg", "sorry at this momment we can't reach");
      res.redirect("/cart");
    }
  },
  demo: async (req, res) => {
    try {
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      const productId = req.params.id;
      const data = await Cart.findOne({ userId: userId });
      console.log(data);
      if (data == null) {
        console.log("if");
        const wishData = await Cart.create({
          userId: userId,
          products: [{ productId: productId }],
        });
      } else {
        console.log("else");
        console.log("uid" + userId);
        console.log("proid" + productId);
        await Cart.updateOne(
          { userId: userId },
          {
            $addToSet: {
              products: {
                productId: [productId],
              },
            },
          }
        );
      }
      res.redirect("/cart");
    } catch (error) {
      console.log(error);
    }
  },
  //removing item from cart
  removeFromCart: async (req, res) => {
    try {
      const { productId, cartId } = req.body;
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res
          .status(404)
          .json({ success: false, error: "Cart not found" });
      }
      cart.products = cart.products.filter(
        (item) => !item.productId.equals(productId)
      );
      await cart.save();
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing product from the cart:", error);
      res.status(500).json({
        success: false,
        error: "Failed to remove product from the cart",
      });
    }
  },

  //update quantity
  updateQuantity: async (req, res) => {
    try {
      const { productId, quantity, cartId } = req.body;
      const cart = await Cart.findOne({ _id: cartId }).populate(
        "products.productId"
      );

      if (!cart) {
        return res
          .status(404)
          .json({ success: false, error: "Cart not found" });
      }
      const productInCart = cart.products.find((item) =>
        item.productId.equals(productId)
      );

      if (!productInCart) {
        return res
          .status(404)
          .json({ success: false, error: "Product not found in the cart" });
      }
      productInCart.quantity = quantity;

      await cart.save();

      let subtotal = 0;
      let totalQuantity = 0;
      cart.products.forEach((item) => {
        subtotal += item.quantity * item.productId.Price;
        totalQuantity += item.quantity;
      });

      const gstRate = 0.12;
      const gstAmount = subtotal * gstRate;
      const coupon = "";
      let total = subtotal + gstAmount;

      if (coupon) {
        const couponValue = 50;
        total -= couponValue;
      }

      res.json({
        success: true,
        subtotal: subtotal,
        gstAmount: gstAmount,
        totalQuantity: totalQuantity,
        coupon: coupon,
        total: total,
      });
    } catch (error) {
      console.error("Error updating stock quantity:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to  update stock quantity" });
    }
  },
};
