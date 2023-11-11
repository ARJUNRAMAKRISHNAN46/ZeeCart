const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const coupons = require("../models/couponModel");
const { ObjectId } = require("mongodb");
const products = require("../models/productModel");

module.exports = {
  checkCoupon: async (req, res) => {
    try {
      const { coupon } = req.body;
      const couponData = await coupons.findOne({ couponCode: coupon });
      console.log(couponData, "------------------------coupon");
      if (couponData) {
        const expiryDateString = couponData.expiryDate;
        const expiryDate = new Date(
          parseInt(expiryDateString.split("-")[2], 10),
          parseInt(expiryDateString.split("-")[1], 10) - 1,
          parseInt(expiryDateString.split("-")[0], 10)
        );
        const currentDate = new Date();

        if (expiryDate < currentDate) {
          if (couponData.maxPurchasetAmount <= req.session.totalPrice) {
            console.log("The coupon is still valid.");
            const couponAmount = couponData.discountAmount;
            const total = req.session.totalPrice;
            req.session.grandTotal = total - couponAmount;
            const grandTotal = req.session.grandTotal;
            req.session.couponCode = coupon;
            req.session.coupon = couponAmount;
            res.json({
              success: true,
              couponAmount,
              grandTotal,
            });
          } else {
            console.log("minimum purchase amount is 100000");
            res.json({
              success: false,
              err: " minimum purchase amount is 100000 ",
            });
          }
        } else {
          console.log("The expiry date has passed. The coupon is expired.");
          res.json({
            success: false,
            err: " coupon expired ",
          });
        }
      } else {
        res.json({
          success: false,
          err: " invalid coupon ",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  Cart: async (req, res) => {
    try {
      const data = await Cart.find();
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;

      const cart = await Cart.findOne({ userId: userId }).populate(
        "products.productId"
      );

      if (cart !== null) {
        let itemPrice = 0;
        let totalQuantity = 0;
        let total = 0;

        cart.products.forEach((item) => {
          total += item.quantity * item.productId.Price;
          itemPrice += item.productId.Price;
          totalQuantity += item.quantity;
        });

        req.session.totalPrice = total;
        req.session.grandTotal = total;

        res.render("user/cart", {
          user,
          product: cart.products,
          cart,
          totalQuantity: totalQuantity,
          total: total,
          itemPrice: itemPrice,
        });
      } else {
        res.render("user/cart", {
          user,
          product: "",
          cart: "",
          totalQuantity: "",
          total: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  addToCart: async (req, res) => {
    try {
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      const productId = req.params.id;

      const cart = await Cart.findOne({ userId: userId });
      if (cart) {
        const productInCart = cart.products.find(
          (product) => product.productId.toString() === productId
        );

        if (productInCart) {
          const quantity = productInCart.quantity;

          await Cart.updateOne(
            {
              userId: userId,
              "products.productId": productId,
            },
            {
              $set: {
                "products.$.quantity": quantity + 1,
              },
            }
          );
        } else {
          const cartData = await Cart.updateOne(
            { userId: userId },
            {
              $push: {
                products: {
                  productId: productId,
                  quantity: 1,
                },
              },
            }
          );
        }
      } else {
        const wishData = await Cart.create({
          userId: userId,
          products: [{ productId: productId, quantity: 1 }],
        });
      }
      res.json({ success: true });
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
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      const carts = await Cart.findOne({ userId: userId }).populate(
        "products.productId"
      );
      const cart = await Cart.findOne({ userId: userId });
      if (!cart) {
        return res
          .status(404)
          .json({ success: false, error: "Cart not found" });
      }
      const productInCart = cart.products.find(
        (product) => product.productId.toString() === productId
      );
      const prodData = await products.findOne({ _id: productInCart.productId });
      console.log(prodData.AvailableQuantity, "................***********");
      if (!productInCart) {
        return res
          .status(404)
          .json({ success: false, error: "Product not found in the cart" });
      }
      if (prodData.AvailableQuantity >= quantity) {
        await Cart.updateOne(
          {
            userId: userId,
            "products.productId": productId,
          },
          {
            $set: {
              "products.$.quantity": quantity,
            },
          }
        );

        let itemPrice = 0;
        let totalQuantity = 0;
        let total = 0;
        const cartz = await Cart.findOne({ userId: userId }).populate(
          "products.productId"
        );
        cartz.products.forEach((item) => {
          total += item.quantity * item.productId.Price;
          itemPrice += item.productId.Price;
          totalQuantity += item.quantity;
        });

        req.session.totalPrice = total;
        req.session.grandTotal = total;

        res.json({
          success: true,
          totalQuantity: totalQuantity,
          total: total,
          itemPrice: itemPrice,
        });
      } else {
        console.log("out of stock");
        res.json({
          success: false,
          err: "out of stock",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
