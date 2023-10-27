const order = require("../models/ordersModel");
const User = require("../models/userModel");

module.exports = {
  Orders: async (req, res) => {
    try {
      const i = 1;
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      const orderDetails = await order
        .find({ userId: userId })
        .populate("products.productId");
      const orders = orderDetails[0].products;
      console.log(orderDetails[0]);
      res.render("user/orders", { orders, i, orderDetails });
    } catch (error) {
      console.log(error);
    }
  },
  //adding cart datas into orders
  addToOrders: async (req, res) => {
    try {
      const { addressId } = req.body;
      const orderData = await Cart.findOne();
      const Order = await order.create({
        userId: orderData.userId,
        products: orderData.products,
        address: addressId,
        paymentMethod: "COD",
        totalAmount: grandTotal,
        orderStatus: "Ordered",
      });
      await Cart.findByIdAndDelete(orderData._id);
    } catch (error) {
      console.log(error);
    }
  },
  viewDetails: async (req, res) => {
    try {
      const productId = req.params.id;
      console.log(productId);
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      const orderDetails = await order
        .find({ userId: userId })
        .populate("products.productId");
      const orders = orderDetails[0].products;
      console.log(orderDetails[0]);
      res.render("user/viewDetails", { orders, orderDetails });
    } catch (error) {
      console.log(error);
    }
  },
};
