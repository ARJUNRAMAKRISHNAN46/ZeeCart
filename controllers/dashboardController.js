const Order = require("../models/ordersModel");
const moment = require("moment");
const { Orders } = require("./orderController");

module.exports = {
  admin_dash: async (req, res) => {
    try {
      const orders = await Order.find().sort({ OrderDate: 1 });
      const targetDateTime = new Date();
      console.log(targetDateTime);

      res.render("admin/dashboard");
    } catch (error) {
      console.log(error);
    }
  },
  getCount: async (req, res) => {
    try {
      console.log("hereeeeeeeeeeee");
      const orders = await Order.find({
        orderStatus: {
          $nin: ["returned", "Cancelled", "Rejected"],
        },
      });

      const orderCountsByDay = {};
      const totalAmountByDay = {};
      const orderCountsByMonthYear = {};
      const totalAmountByMonthYear = {};
      const orderCountsByYear = {};
      const totalAmountByYear = {};
      let labelsByCount;
      let labelsByAmount;

      orders.forEach((order) => {
        // const orderDate = moment(order.OrderDate, "M/D/YYYY, h:mm:ss A");
        const orderDate = moment(order.OrderDate, "ddd MMM DD YYYY");
        const dayMonthYear = orderDate.format("YYYY-MM-DD");
        const monthYear = orderDate.format("YYYY-MM");
        const year = orderDate.format("YYYY");

        if (req.url === "/count-orders-by-day") {
          console.log(orderCountsByDay[dayMonthYear], "count");
          if (!orderCountsByDay[dayMonthYear]) {
            orderCountsByDay[dayMonthYear] = 1;
            totalAmountByDay[dayMonthYear] = order.totalAmount;
          } else {
            orderCountsByDay[dayMonthYear]++;
            totalAmountByDay[dayMonthYear] += order.totalAmount;
          }
          console.log(totalAmountByDay[dayMonthYear], "total------------->");
          const ordersByDay = Object.keys(orderCountsByDay).map(
            (dayMonthYear) => ({
              _id: dayMonthYear,
              count: orderCountsByDay[dayMonthYear],
            })
          );

          const amountsByDay = Object.keys(totalAmountByDay).map(
            (dayMonthYear) => ({
              _id: dayMonthYear,
              total: totalAmountByDay[dayMonthYear],
            })
          );

          amountsByDay.sort((a, b) => (a._id < b._id ? -1 : 1));
          ordersByDay.sort((a, b) => (a._id < b._id ? -1 : 1));

          labelsByCount = ordersByDay.map((entry) =>
            moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY")
          );

          labelsByAmount = amountsByDay.map((entry) =>
            moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY")
          );

          dataByCount = ordersByDay.map((entry) => entry.count);
          dataByAmount = amountsByDay.map((entry) => entry.total);
        } else if (req.url === "/count-orders-by-month") {
          if (!orderCountsByMonthYear[monthYear]) {
            orderCountsByMonthYear[monthYear] = 1;
            totalAmountByMonthYear[monthYear] = order.TotalPrice;
          } else {
            orderCountsByMonthYear[monthYear]++;
            totalAmountByMonthYear[monthYear] += order.TotalPrice;
          }

          const ordersByMonth = Object.keys(orderCountsByMonthYear).map(
            (monthYear) => ({
              _id: monthYear,
              count: orderCountsByMonthYear[monthYear],
            })
          );
          const amountsByMonth = Object.keys(totalAmountByMonthYear).map(
            (monthYear) => ({
              _id: monthYear,
              total: totalAmountByMonthYear[monthYear],
            })
          );

          ordersByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));
          amountsByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));

          labelsByCount = ordersByMonth.map((entry) =>
            moment(entry._id, "YYYY-MM").format("MMM YYYY")
          );
          labelsByAmount = amountsByMonth.map((entry) =>
            moment(entry._id, "YYYY-MM").format("MMM YYYY")
          );
          dataByCount = ordersByMonth.map((entry) => entry.count);
          dataByAmount = amountsByMonth.map((entry) => entry.total);
        } else if (req.url === "/count-orders-by-year") {
          // Count orders by year
          if (!orderCountsByYear[year]) {
            orderCountsByYear[year] = 1;
            totalAmountByYear[year] = order.TotalPrice;
          } else {
            orderCountsByYear[year]++;
            totalAmountByYear[year] += order.TotalPrice;
          }

          const ordersByYear = Object.keys(orderCountsByYear).map((year) => ({
            _id: year,
            count: orderCountsByYear[year],
          }));
          const amountsByYear = Object.keys(totalAmountByYear).map((year) => ({
            _id: year,
            total: totalAmountByYear[year],
          }));

          ordersByYear.sort((a, b) => (a._id < b._id ? -1 : 1));
          amountsByYear.sort((a, b) => (a._id < b._id ? -1 : 1));

          labelsByCount = ordersByYear.map((entry) => entry._id);
          labelsByAmount = amountsByYear.map((entry) => entry._id);
          dataByCount = ordersByYear.map((entry) => entry.count);
          dataByAmount = amountsByYear.map((entry) => entry.total);
        }
      });

      res.json({ labelsByCount, labelsByAmount, dataByCount, dataByAmount });
    } catch (error) {
      console.error("error while chart loading :", error);
    }
  },
  getSalesOrder: async (req, res) => {
    try {
      const latestOrders = await Order.find().sort({ _id: -1 }).limit(6);

      const bestSeller = await Order.aggregate([
        {
          $unwind: "$products",
        },
        {
          $group: {
            _id: "$products.productId",
            totalCount: { $sum: "$products.quantity" },
          },
        },
        {
          $sort: {
            totalCount: -1,
          },
        },
        {
          $limit: 6,
        },
        {
          $lookup: {
            from: "productuploads",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        // {
        //   $unwind: "$productDetails",
        // },
        // { $project: { _id: 1, totalCount: 1, productDetails: 1 }}
      ]);
      bestSeller.forEach((x) => {
        console.log(x?.productDetails[0]?.ProductName,'-------------------!!!');
      })

      if (!latestOrders || !bestSeller) throw new Error("No Data Found");

      res.json({ latestOrders, bestSeller });
    } catch (error) {
      console.log(
        "error while fetching the order details in the dashboard",
        error
      );
    }
  },
};
