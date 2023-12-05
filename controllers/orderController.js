const order = require("../models/ordersModel");
const User = require("../models/userModel");
const Address = require("../models/addressModel");
const Cart = require("../models/cartModel");
const moment = require("moment");
const { generateInvoicePDF } = require("../util/downloadInvoice");
const Wallet = require("../models/walletModel");
const products = require("../models/productModel");
const pdf = require("../util/salesReportPDF");
const returnItem = require("../models/retunModel");
const WalletHistory = require("../models/walletHistoryModel");
const { generateSalesPDF } = require("../util/downloadSalesReport");

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
        .sort({ orderDate: -1 })
        .populate("products.productId");
      if (orderDetails[0] == undefined) {
      } else {
      }

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
      const totalAmount = Total;
      let amount;
      if (grandTotal) {
        amount = grandTotal;
      } else {
        amount = Total;
      }
      const addressId = req.params.id;
      const [curAdd, orderData] = await Promise.all([
        Address.findOne({ _id: addressId }),
        Cart.findOne(),
      ]);
      const currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const fourDaysLater = new Date(
        Date.now() + 4 * 24 * 60 * 60 * 1000
      ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      let couponCode = "";
      let couponDiscount = 0;
      if (req.session.couponDiscount && req.session.couponCode) {
        couponDiscount = req.session.couponDiscount;
        couponCode = req.session.couponCode;
      }
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
        orderDate: currentDate,
        expectedDeliveryDate: fourDaysLater,
        paymentMethod: "online",
        PaymentStatus: "Paid",
        orderStatus: "Order Processed",
        couponCode: couponCode,
        couponDiscount: couponDiscount,
        totalAmount: totalAmount,
        discountAmount: amount,
      });
      req.session.couponCode = "";
      req.session.couponDiscount = 0;
      const prodId = orderData.products;
      prodId.forEach(async (x) => {
        const quantity = x.quantity;
        const id = x.productId;
        const stock = proData.AvailableQuantity;
        const newQuantity = stock - quantity;
        const [proData, product] = await Promise.all([
          products.findOne({ _id: id }),
          products.updateOne(
            { _id: id },
            {
              $set: { AvailableQuantity: newQuantity },
            }
          ),
        ]);
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
      const [dataCount, orderDetails] = await Promise.all([
        order.find().count(),
        order
          .find()
          .sort({ orderDate: -1 })
          .skip((pageNum - 1) * perPage)
          .limit(perPage),
      ]);

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
      const newPaid = "Paid";
      if (newStatus == "Order Arrived") {
        await order.findByIdAndUpdate(orderId, {
          $set: { PaymentStatus: newPaid },
        });
      }
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
    const email = req.session.email;
    const userData = await User.findOne({email})
    const orderDetails = await order
      .findOne({ _id: orderId })
      .populate("products.productId");
    let result = await generateInvoicePDF(orderDetails,userData);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Invoice.pdf"
    );

    res.status(200).end(result);
  },
  cashOnDelivery: async (req, res) => {
    try {
      const grandTotal = req.session.grandTotal;
      const Total = req.session.totalPrice;
      const totalAmount = Total;
      const addressId = req.body.id;
      const email = req.session.email;
      const userData = await User.findOne({ email });

      let amount;
      if (grandTotal) {
        amount = grandTotal;
      } else {
        amount = Total;
      }
      const [curAdd, orderData] = await Promise.all([
        Address.findOne({ _id: addressId }),
        Cart.findOne({ userId: userData._id }),
      ]);
      const currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const fourDaysLater = new Date(
        Date.now() + 4 * 24 * 60 * 60 * 1000
      ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      let couponCode = "";
      let couponDiscount = 0;
      if (req.session.couponDiscount && req.session.couponCode) {
        couponDiscount = req.session.couponDiscount;
        couponCode = req.session.couponCode;
      }
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
        orderDate: currentDate,
        expectedDeliveryDate: fourDaysLater,
        paymentMethod: "COD",
        PaymentStatus: "Pending",
        orderStatus: "Order Processed",
        couponCode: couponCode,
        couponDiscount: couponDiscount,
        totalAmount: totalAmount,
        discountAmount: amount,
      });
      req.session.couponCode = "";
      req.session.couponDiscount = 0;
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
      const cartDetails = await Cart.findByIdAndDelete(orderData._id);
      const orderId = Order._id;
      const total = req.session.grandTotal;
      res.render("user/paymentSuccess", { total, userData });
    } catch (error) {
      console.log(error);
    }
  },
  getDownloadSalesReport: async (req, res) => {
    try {
      // const format = req.body.fileFormat;
      let startDate = new Date();
      let endDate = new Date();
      // endDate.setHours(23, 59, 59, 999);

      // const orders = await order
      //   .find({
      //     PaymentStatus: "Paid",
      //     orderDate: {
      //       $gte: startDate,
      //       $lte: endDate,
      //     },
      //   })
      //   .populate("products.productId");
      const orders = await order.find().populate("products.productId");

      let totalSales = 0;
      orders.forEach((order) => {
        totalSales += order.totalAmount || 0;
      });

      const sum = totalSales.length > 0 ? totalSales[0].totalSales : 0;
      pdf.downloadPdf(req, res, orders, startDate, endDate, totalSales);
    } catch (error) {
      console.log(error);
    }
  },
  returnRequest: async (req, res) => {
    try {
      const orderId = req.params.id;
      const [orderData, user, retres, orderDetails] = await Promise.all([
        order.findOne({ _id: orderId }),
        User.findOne({ _id: orderData.userId }),
        returnItem.findOne({ userId: orderData.userId }),
        order.find({ _id: orderId }).populate("products.productId"),
      ]);
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
      const [updatedOrder, orderData] = await Promise.all([
        order.findByIdAndUpdate(
          orderId,
          { orderStatus: newStatus },
          { new: true }
        ),
        order.findOne({ _id: orderId }),
      ]);
      const userId = data.userId;

      let amount;
      if (orderData.discountAmount) {
        amount = orderData.discountAmount;
      } else {
        amount = orderData.totalAmount;
      }
      const refund = await Wallet.findOne({ userId: userId });
      if (refund) {
        const walletHistory = await WalletHistory.findOne({
          userId: userId,
        });
        if (walletHistory !== null) {
          const reason = "Refund for cancelling order";
          const type = "credit";
          const date = new Date();
          await WalletHistory.findOneAndUpdate(
            { userId },
            {
              $push: {
                refund: {
                  amount: amount,
                  reason: reason,
                  type: type,
                  date: date,
                },
              },
            },
            { new: true }
          );
        } else {
          const reason = "Refund for cancelling order";
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
        const updateAmount = Number(amount) + Number(refund.wallet);

        // const priceInc = await Wallet.findByIdAndUpdate(
        //   userId,
        //   { wallet: updateAmount },
        //   { new: true }
        // );
        const priceInc = await Wallet.updateOne({
          userId: userId,
          wallet: updateAmount,
        });
      } else {
        const walletHistory = await WalletHistory.findOne({
          userId: userId,
        });
        if (walletHistory !== null) {
          const reason = "Refund for cancelling order";
          const type = "credit";
          const date = new Date();
          await WalletHistory.findOneAndUpdate(
            { userId },
            {
              $push: {
                refund: {
                  amount: amount,
                  reason: reason,
                  type: type,
                  date: date,
                },
              },
            },
            { new: true }
          );
        } else {
          const reason = "Refund for cancelling order";
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
        const updateAmount = Number(amount) + Number(refund.wallet);

        const priceInc = await Wallet.updateOne({
          userId: userId,
          wallet: updateAmount,
        });
      }
      res.redirect("/orders");
    } catch (error) {
      console.log(error);
    }
  },
  generateOrderInvoice: async (req, res) => {
    try {
      let startDate = new Date(req.body.startDate);
      let endDate = new Date(req.body.endDate);
      endDate.setHours(23, 59, 59, 999);
      const Order = await order
        .find({
          PaymentStatus: "Paid",
          orderDate: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .populate("products.productId");

      // const Order = await order
      //   .find({ PaymentStatus: "Paid" })
      //   .populate("products.productId");
      // const startDate = '23-11-2023';
      // const endDate = '23-12-2023';
      const pdfBuffer = await generateSalesPDF(Order, startDate, endDate);

      // Set headers for the response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=sales Report.pdf"
      );

      res.status(200).end(pdfBuffer);
    } catch (error) {
      console.log(error);
      res.redirect("/dashboard");
      // res.status(400).json({ error: error.message });
    }
  },
};
