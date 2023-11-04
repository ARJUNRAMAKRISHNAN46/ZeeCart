const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const coupons = require("../models/couponModel");
const { ObjectId } = require("mongodb");

//getting cart page
module.exports = {
  checkCoupon: async (req, res) => {
    try {
      const { coupon } = req.body;
     
      const couponData = await coupons.findOne({ couponCode: coupon });
      
      if (couponData) {
        couponAmount = couponData.discountAmount;
        console.log("success------------>>>");
        res.json({
          success: true,
          couponAmount,
        });
      } else {
        res.json({
          success: false,
          err: "invalid coupon",
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

      const cartData = cart.products;

      let subtotal = 0;
      let totalQuantity = 0;
      let coupon = 0;

      cart.products.forEach((item) => {
        subtotal += 1 * item.productId.Price;
        totalQuantity += item.quantity;
      });

      const gstRate = 0.12;
      const gstAmount = subtotal * gstRate;
      let total = subtotal + gstAmount;

      if (coupon) {
        let couponValue = coupon;
        total -= couponValue;
      }
      grandTotal = total;
      coupon = "";
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
      if (data == null) {
        const wishData = await Cart.create({
          userId: userId,
          products: [{ productId: productId, quantity: 1 }],
        });
      } else {
        await Cart.updateOne(
          { userId: userId },
          {
            $addToSet: {
              products: {
                productId: [productId],
                quantity: 1,
              },
            },
          }
        );
      }
      res.json({ success: true });
      // res.redirect("/cart");
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
      const { productId, quantity, cartId,coupon } = req.body;
      console.log(coupon,'hereeeeeeeeeeeeeeeeeeeeeee');
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
      // const coupon = "";
      let total = subtotal + gstAmount;
      
      if (coupon) {
        const couponValue = 50;
        total -= couponValue;
      }

      req.session.totalPrice = total;

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
