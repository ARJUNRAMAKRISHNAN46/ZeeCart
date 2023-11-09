const Users = require("../models/userModel");
const multer = require("multer");
const Catagory = require("../models/catagoryModel");

module.exports = {
  
  //admin validation
  admin_Login: async (req, res) => {
    try {
      const credential = {
        //setting credential for admin
        email: "admin@gmail.com",
        password: 12345678,
      };
      const { email, password } = req.body;
      //checking the entered email and password
        if (email == credential.email && password == credential.password) {
          req.session.adLogged = true;
          res.redirect("/dashboard");
        } else {
          res.render("admin/login", { err: "invalid username or password" });
          console.log("invalid username or password");
        }
    } catch (error) {
      console.log(error);
    }
  },
  //admin login page
  adHost: async (req, res) => {
    try {
      res.render("admin/login", { err: "" });
    } catch (error) {
      console.log(error);
    }
  },

  adminLogOut: async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/adminpanel");
    } catch (error) {
      console.log(error);
    }
  },

  
  admin_dash: async (req, res) => {
    try {
      res.render("admin/dashboard");
    } catch (error) {
      console.log(error);
    }
  },

  admin_admin: async (req, res) => {
    try {
      res.render("admin/admin");
    } catch (error) {
      console.log(error);
    }
  },

  admin_banners: async (req, res) => {
    try {
      res.render("admin/banners");
    } catch (error) {
      console.log(error);
    }
  },

  admin_payments: async (req, res) => {
   try {
    const catData = await Catagory.find();
    console.log(catData);
    res.render("admin/offerManagement",{ catData });
   } catch (error) {
    console.log(error);
   }
  },
};
