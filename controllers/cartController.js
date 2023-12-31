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
      if (couponData) {
        req.session.couponCode = coupon;
        const expiryDateString = couponData.expiryDate;
        const expiryDate = new Date(
          parseInt(expiryDateString.split("-")[2], 10),
          parseInt(expiryDateString.split("-")[1], 10) - 1,
          parseInt(expiryDateString.split("-")[0], 10)
        );
        const currentDate = new Date();

        if (expiryDate < currentDate) {
          if (couponData.minPurchasetAmount <= req.session.totalPrice) {
            req.session.couponDiscount = couponData.discountAmount;
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
            res.json({
              success: false,
              err: `minimum purchase amount is ${couponData.minPurchasetAmount}`,
            });
          }
        } else {
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
      const email = req.session.email;
      const [data, cartData, user] = await Promise.all([
        User.findOne({ email }),
        Cart.find(),
        User.findOne({ email }),
      ]);
      const userId = user._id;

      const cart = await Cart.findOne({ userId: userId }).populate(
        "products.productId"
      );

      if (cart !== null) {
        let itemPrice = 0;
        let totalQuantity = 0;
        let total = 0;

        cart.products.forEach((item) => {
          total += item.quantity * item.productId.DiscountAmount;
          itemPrice += item.productId.DiscountAmount;
          totalQuantity += item.quantity;
        });

        req.session.totalPrice = total;
        req.session.grandTotal = total;
        req.session.couponCode = "";
        req.session.coupon = 0;
        res.render("user/cart", {
          user,
          product: cart.products,
          cart,
          totalQuantity: totalQuantity,
          total: total,
          itemPrice: itemPrice,
          data,
        });
      } else {
        res.render("user/cart", {
          user,
          product: "",
          cart: "",
          totalQuantity: "",
          total: "",
          data,
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
      const quan = await Cart.findOne({ userId });
      const quantity = quan.products.length;
      res.json({ success: true, quantity: quantity });
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
      const [carts, cart] = await Promise.all([
        Cart.findOne({ userId: userId }).populate("products.productId"),
        Cart.findOne({ userId: userId }),
      ]);
      if (!cart) {
        return res
          .status(404)
          .json({ success: false, error: "Cart not found" });
      }
      const productInCart = cart.products.find(
        (product) => product.productId.toString() === productId
      );
      const prodData = await products.findOne({ _id: productInCart.productId });
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
          total += item.quantity * item.productId.DiscountAmount;
          itemPrice += item.productId.DiscountAmount;
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
        res.json({
          success: false,
          err: "out of stock",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  getQuantity: async (req, res) => {
    try {
      const email = req.session.email;
      const user = await User.findOne({ email: email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      const userId = user._id;

      const cart = await Cart.findOne({ userId: userId });

      if (!cart) {
        // If the cart doesn't exist, return a response with quantity 0
        return res.json({ success: true, quantity: 0 });
      }

      const totalQuantity = cart.calculateTotalQuantity();

      res.json({ success: true, quantity: totalQuantity });
    } catch (error) {
      console.error("Error fetching cart quantity:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch cart quantity" });
    }
  },
};
