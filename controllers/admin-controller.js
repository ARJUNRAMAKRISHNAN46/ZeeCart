const Users = require("../models/userModel");
const multer = require("multer");

module.exports = {
  admin_Users: async (req, res) => {
    if (req.session.logged) {
      res.redirect("/dashboard"); 
    } else {
      //creating pagination
      const pageNum = req.query.page;
      const perPage = 10;
      const countData = await Users.find().count();
      // console.log(countData);
      const userData = await Users.find()
        .skip((pageNum - 1) * perPage)
        .limit(perPage);
      let i = (pageNum - 1) * perPage;
      res.render("admin/userList", { title: "admin-user list", userData, i });
    }
  },
  //admin validation
  admin_Login: async (req, res) => {
    const credential = {
      //setting credential for admin
      email: "abcd@gmail.com",
      password: 123,
    };
    const { email, password } = req.body;
    //checking the entered email and password
    if (req.session.logged) {
      res.redirect("/dashboard");
    } else {
      if (email == credential.email && password == credential.password) {
        res.redirect("/dashboard");
        req.session.logged = true;
      } else {
        console.log("invalid username or password");
      }
    }
  },
  //admin login page
  adHost: async (req, res) => {
    res.render("admin/login", { err: "" });
  },

  adminLogOut: async (req, res) => {
    req.session.destroy();
    res.redirect("/adminpanel");
  },

  user_Blocking: async (req, res) => {
    try {
      //user control (user blocking and unblocking)
      const id = req.params.id;
      const blockData = await Users.findOne({ _id: id });
      if (blockData.statuz == "Active") {
        const blocked = await Users.updateOne(
          { _id: id },
          { statuz: "Blocked" }
        );
      } else if (blockData.statuz == "Blocked") {
        const blocked = await Users.updateOne(
          { _id: id },
          { statuz: "Active" }
        );
      }
      //setting pagination for admin-user controller page
      const pageNum = req.query.page;
      const perPage = 10;
      const userData = await Users.find()
        .skip((pageNum - 1) * perPage)
        .limit(perPage);
      let i = (pageNum - 1) * perPage;

      res.render("admin/userList", { title: "admin-user list", userData, i });
    } catch (error) {
      console.log("an error occured in userlist");
    }
  },
  admin_dash: async (req, res) => {
    res.render("admin/dashboard");
  },

  admin_admin: async (req, res) => {
    res.render("admin/admin");
  },

  admin_banners: async (req, res) => {
    res.render("admin/banners");
  },

  admin_coupon: async (req, res) => {
    res.render("admin/coupon");
  },

  admin_orders: async (req, res) => {
    res.render("admin/orders");
  },

  admin_payments: async (req, res) => {
    res.render("admin/payment");
  },
};
