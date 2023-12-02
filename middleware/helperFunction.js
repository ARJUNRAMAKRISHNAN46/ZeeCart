const Cart = require("../models/cartModel");
const User = require("../models/userModel");

const CartCount = async (req, res, next) => {
  try {
    const email = req.session.email;
    const user = await User.findOne({ email: email });
    if (user) {
      const userId = user._id;
      const cartData = await Cart.findOne({ userId });

      if (cartData) {
        const cartCount = cartData.products.length;
        // let cartCount = 0;
        // for (const product of cartData.products) {
        //   cartCount += product.quantity;
        // }
        res.locals.cartCount = cartCount;
        res.locals.name = user.name;
      } else {
        res.locals.cartCount = 0;
        res.locals.name = user.name;
      }
    }
    next();
  } catch (error) {
    console.error(error);
    res.locals.cartCount = 0;
    next();
  }
};

module.exports = CartCount;
