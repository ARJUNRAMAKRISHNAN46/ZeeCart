const order = require("../models/ordersModel");
const User = require("../models/userModel");
const Address = require("../models/addressModel");
const Cart = require("../models/cartModel");
const moment = require("moment");
const { invoiceDownload } = require("../util/invoice");
const Wallet = require("../models/walletModel");
const products = require("../models/productModel");
module.exports = {
  //getting order page
  Orders: async (req, res) => {
    try {
      const i = 1;
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      const active = "active step0";
      const orderDetails = await order
        .find({ userId: userId })
        .populate("products.productId");
      if (orderDetails[0] == undefined) {
      } else {
      }
      const addressId = orderDetails[0].address;
      const addressDetails = await Address.find({ _id: addressId }).populate(
        "address"
      );
      res.render("user/orders", { orderDetails, active, addressDetails });
    } catch (error) {
      console.log(error);
    }
  },
  //adding cart datas into orders
  addToOrders: async (req, res) => {
    try {
      const grandTotal = req.session.totalPrice;
      const addressId = req.params.id;
      const orderData = await Cart.findOne();
      const currentDate = new Date();
      const fourDaysLater = new Date(currentDate);
      fourDaysLater.setDate(currentDate.getDate() + 4);
      const Order = await order.create({
        userId: orderData.userId,
        products: orderData.products,
        address: addressId,
        OrderDate: currentDate.toDateString(),
        ExpectedDeliveryDate: fourDaysLater.toDateString(),
        paymentMethod: "online",
        PaymentStatus: "Pending",
        totalAmount: grandTotal,
        orderStatus: "Order Processed",
      });

      const prodId = orderData.products;
      prodId.forEach(async (x) => {
        const quantity = x.quantity;
        const id = x.productId;
        const proData = await products.findOne({ _id: id });
        const stock = proData.AvailableQuantity;
        const newQuantity = stock - quantity;
        const product = await products.updateOne(
          { _id: id },
          {
            $set: { AvailableQuantity: newQuantity },
          }
        );
      });
      await Cart.findOneAndDelete({ userId: orderData.userId });
      const orderId = Order._id;
      res.json({
        success: true,
        orderId,
      });
    } catch (error) {
      console.log(error);
    }
  },
  viewDetails: async (req, res) => {
    try {
      const orderId = req.params.id;
      const addressId = req.query.id;

      const orderDetails = await order
        .find({ _id: orderId })
        .populate("products.productId");
      const addressDetails = await Address.find({ _id: addressId }).populate(
        "address"
      );
      const orderData = orderDetails[0].products;
      res.render("admin/viewDetails", {
        orderDetails,
        orderData,
        addressDetails,
        orderId,
      });
    } catch (error) {
      console.log(error);
    }
  },
  admin_orders: async (req, res) => {
    try {
      const pageNum = req.query.page;
      const perPage = 10;
      const dataCount = await order.find().count();
      const orderDetails = await order
        .find()
        .sort({ OrderDate: -1 })
        .skip((pageNum - 1) * perPage)
        .limit(perPage);
      let i = (pageNum - 1) * perPage;
      res.render("admin/orders", { orderDetails, i, dataCount });
    } catch (error) {
      console.log(error);
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      const orderId = req.params.id;
      const newStatus = req.body.status;
      await order.findByIdAndUpdate(orderId, { orderStatus: newStatus });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.json({ success: false });
    }
  },
  deleteOrderStatus: async (req, res) => {
    try {
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      const orderId = req.params.id;
      const newStatus = req.query.status;
      await order.findByIdAndUpdate(orderId, { orderStatus: newStatus });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.json({ success: false });
    }
  },
  downloadInvoice: async (req, res) => {
    const orderId = req.params.id;
    const orderDetails = await order
      .find({ _id: orderId })
      .populate("products.productId");
    const addressDetails = await order
      .find({ _id: orderId })
      .populate("address");
    let result = await invoiceDownload(orderDetails, addressDetails, orderId);
    res.redirect("/productorders");
  },
  downloadfile: async (req, res) => {
    const id = req.params._id;
    const filePath = `C:/Users/user/Desktop/Ticker/public/pdf/${id}.pdf`;
    res.download(filePath, `invoice.pdf`);
  },
  cashOnDelivery: async (req, res) => {
    try {
      const grandTotal = req.session.totalPrice;
      const addressId = req.body.id;
      const orderData = await Cart.findOne();
      const currentDate = new Date();
      const fourDaysLater = new Date(currentDate);
      fourDaysLater.setDate(currentDate.getDate() + 4);
      const Order = await order.create({
        userId: orderData.userId,
        products: orderData.products,
        address: addressId,
        OrderDate: currentDate.toDateString(),
        ExpectedDeliveryDate: fourDaysLater.toDateString(),
        paymentMethod: "COD",
        PaymentStatus: "Pending",
        totalAmount: grandTotal,
        orderStatus: "Order Processed",
      });
      const prodId = orderData.products;
      prodId.forEach(async (x) => {
        const quantity = x.quantity;
        const id = x.productId;
        const proData = await products.findOne({ _id: id });
        const stock = proData.AvailableQuantity;
        const newQuantity = stock - quantity;
        const product = await products.updateOne(
          { _id: id },
          {
            $set: { AvailableQuantity: newQuantity },
          }
        );
      });
      await Cart.findOneAndDelete({ userId: orderData.userId });
      const orderId = Order._id;
      const email = req.session.email;
      const userData = await User.findOne({ email });
      const total = req.session.grandTotal;
      res.render("user/paymentSuccess", { total, userData });
    } catch (error) {
      console.log(error);
    }
  },
};
