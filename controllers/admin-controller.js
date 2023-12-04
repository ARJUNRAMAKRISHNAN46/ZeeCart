const Users = require("../models/userModel");
const multer = require("multer");
const Catagory = require("../models/catagoryModel");
const offer = require("../models/offerModel");

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
      req.session.adLogged = false;
      res.redirect("/adminpanel");
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

  admin_offers: async (req, res) => {
    try {
      const [catData, offersData] = await Promise.all([
        Catagory.find(),
        Offer.find(),
      ]);
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      res.render("admin/offerManagement", {
        catData,
        offers,
        formattedDate,
        err: "",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
