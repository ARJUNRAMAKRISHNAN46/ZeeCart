const order = require("../models/ordersModel");
const User = require("../models/userModel");
const Address = require("../models/addressModel");
const Cart = require("../models/cartModel");
const moment = require("moment");
const { invoiceDownload } = require("../util/invoice");
const Wallet = require("../models/walletModel");
const products = require("../models/productModel");
const pdf = require("../util/salesReportPDF");
const returnItem = require("../models/retunModel");
const WalletHistory = require("../models/walletHistoryModel");

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
      console.log(orderDetails, "odrsf");
      if (orderDetails[0] == undefined) {
      } else {
      }
      console.log(
        orderDetails,
        "------------------------------------------------------------------------------------------------------>"
      );
      res.render("user/orders", { orderDetails, active });
    } catch (error) {
      console.log(error);
    }
  },
  //adding cart datas into orders
  addToOrders: async (req, res) => {
    try {
      const Total = req.session.totalPrice;
      const grandTotal = req.session.grandTotal;
      console.log(Total, grandTotal);
      let amount;
      if (grandTotal) {
        amount = grandTotal;
      } else {
        amount = Total;
      }
      const addressId = req.params.id;
      const curAdd = await Address.findOne({ _id: addressId });
      const orderData = await Cart.findOne();
      const currentDate = new Date();
      const fourDaysLater = new Date(currentDate);
      fourDaysLater.setDate(currentDate.getDate() + 4);
      const Order = await order.create({
        userId: orderData.userId,
        products: orderData.products,
        address: {
          houseName: curAdd.houseName,
          locality: curAdd.locality,
          city: curAdd.city,
          district: curAdd.district,
          state: curAdd.state,
          pincode: curAdd.pincode,
        },
        orderDate: currentDate.toDateString(),
        expectedDeliveryDate: fourDaysLater.toDateString(),
        paymentMethod: "online",
        PaymentStatus: "Paid",
        totalAmount: amount,
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
      const user = await User.findOne({ _id: orderDetails[0].userId });
      const orderData = orderDetails[0].products;
      res.render("admin/viewDetails", {
        orderDetails,
        orderData,
        orderId,
        user,
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
        .sort({ orderDate: -1 })
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
      const grandTotal = req.session.grandTotal;
      const Total = req.session.totalPrice;
      const addressId = req.body.id;
      console.log(grandTotal, grandTotal);
      let amount;
      if (grandTotal) {
        amount = grandTotal;
      } else {
        amount = Total;
      }
      const curAdd = await Address.findOne({ _id: addressId });
      const orderData = await Cart.findOne();
      const currentDate = new Date();
      const fourDaysLater = new Date(currentDate);
      fourDaysLater.setDate(currentDate.getDate() + 4);
      const Order = await order.create({
        userId: orderData.userId,
        products: orderData.products,
        address: {
          houseName: curAdd.houseName,
          locality: curAdd.locality,
          city: curAdd.city,
          district: curAdd.district,
          state: curAdd.state,
          pincode: curAdd.pincode,
        },
        orderDate: currentDate.toDateString(),
        expectedDeliveryDate: fourDaysLater.toDateString(),
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
  getDownloadSalesReport: async (req, res) => {
    console.log(req.body);
    try {
      let startDate = new Date(req.body.startDate);
      const format = req.body.fileFormat;
      let endDate = new Date(req.body.endDate);
      endDate.setHours(23, 59, 59, 999);

      const orders = await order
        .find({
          PaymentStatus: "Paid",
          orderDate: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .populate("products.productId");

      let totalSales = 0;
      orders.forEach((order) => {
        totalSales += order.totalAmount || 0;
      });

      console.log(totalSales, "orderssss");
      const sum = totalSales.length > 0 ? totalSales[0].totalSales : 0;
      pdf.downloadPdf(req, res, orders, startDate, endDate, totalSales);
    } catch (error) {
      console.log(error);
    }
  },
  returnRequest: async (req, res) => {
    try {
      const orderId = req.params.id;
      const orderData = await order.findOne({ _id: orderId });
      const user = await User.findOne({ _id: orderData.userId });
      const retres = await returnItem.findOne({ userId: orderData.userId });
      const orderDetails = await order
        .find({ _id: orderId })
        .populate("products.productId");
      const products = orderDetails[0].products;
      res.render("admin/returnRequest", { orderData, retres, user, products });
    } catch (error) {
      console.log(error);
    }
  },
  rejectReturn: async (req, res) => {
    try {
      const orderId = req.params.id;
      const newStatus = "rejected";
      console.log(orderId);
      const data = await order.findByIdAndUpdate(orderId, {
        orderStatus: newStatus,
      });
      res.redirect("/orders");
    } catch (error) {
      console.log(error);
    }
  },
  acceptReturn: async (req, res) => {
    try {
      const orderId = req.params.id;
      const newStatus = "Return Order";
      const data = await order.findByIdAndUpdate(orderId, {
        orderStatus: newStatus,
      });
      const userId = data.userId;
      const orderData = await order.findOne({ _id: orderId });

      let amount = orderData.totalAmount;
      const refund = await Wallet.findOne({ userId: userId });
      if (refund) {
        const walletHistory = await WalletHistory.findOne({
          userId: userId,
        });
        if (walletHistory !== null) {
          const reason = "Refund for cancelling order";
          const type = "credit";
          const date = new Date();
          await WalletHistory.updateMany({
            userId: userId,
            $push: {
              refund: {
                amount: amount,
                reason: reason,
                type: type,
                date: date,
              },
            },
          });
        } else {
          const reason = "Referal Bonus";
          const type = "credit";
          const date = new Date();
          await WalletHistory.create({
            userId: userId,
            refund: [
              {
                amount: amount,
                reason: reason,
                type: type,
                date: date,
              },
            ],
          });
        }
        const updateAmount = amount + refund.wallet;
        await Wallet.updateOne({ userId: userId, wallet: updateAmount });
      } else {
        const walletHistory = await WalletHistory.findOne({
          userId: userId,
        });
        if (walletHistory !== null) {
          const reason = "Refund for cancelling order";
          const type = "credit";
          const date = new Date();
          await WalletHistory.updateMany({
            userId: userId,
            $push: {
              refund: {
                amount: amount,
                reason: reason,
                type: type,
                date: date,
              },
            },
          });
        } else {
          const reason = "Referal Bonus";
          const type = "credit";
          const date = new Date();
          await WalletHistory.create({
            userId: userId,
            refund: [
              {
                amount: amount,
                reason: reason,
                type: type,
                date: date,
              },
            ],
          });
        }
        await Wallet.create({ userId: userId, wallet: amount });
      }
      res.redirect("/orders");
    } catch (error) {
      console.log(error);
    }
  },
};
