const { Users, Brand, Catagory, productuploads } = require("../models/model");
const multer = require("multer");

module.exports = {
  //<---------------------------------------------Brands------------------------------------------------------------->
  admin_brands: async (req, res) => {
    if (req.session.logged) {
      res.redirect("/dashboard");
    } else {
      //creating pagination
      const pageNum = req.query.page;
      const perPage = 10;
      const brandz = await Brand.find()
        .skip((pageNum - 1) * perPage)
        .limit(perPage);
      let i = (pageNum - 1) * perPage;
      res.render("admin/brands", { title: "admin brands", brandz, i });
    }
  },
  // <---------------------------------------------Users------------------------------------------------------------->
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

  // <---------------------------------------------Catagory----------------------------------------------------------->
  admin_catagory: async (req, res) => {
    if (req.session.logged) {
      res.redirect("/dashboard");
    } else {
      //creating pagination
      const pageNum = req.query.page;
      const perPage = 10;
      const catagoryz = await Catagory.find()
        .skip((pageNum - 1) * perPage)
        .limit(perPage);
      let i = (pageNum - 1) * perPage;
      res.render("admin/catagory", { catagoryz, i, err: "" });
    }
  },

  // <---------------------------------------------Product------------------------------------------------------------->
  admin_product: async (req, res) => {
    if (req.session.logged) {
      res.redirect("/dashboard");
    } else {
      //creating pagination
      const pageNum = req.query.page;
      const perPage = 10;
      const productDetails = await productuploads
        .find()
        .skip((pageNum - 1) * perPage)
        .limit(perPage);
      const i = (pageNum - 1) * perPage;
      console.log(productDetails);

      res.render("admin/products", { productDetails, i });
    }
  },
  // <---------------------------------------------------------------------------------------------------------->
  product_upload: async (req, res) => {
    res.render("admin/addProducts");
  },

  // -----------------------------------------------Get addProduct-----------------------------------------------------------

  getAddProduct: (req, res) => {
    res.render("admin/new");
  },

  // -----------------------------------------------Post addProduct-----------------------------------------------------------

  AddProduct: async (req, res) => {
    const productDetails = req.body;
    try {
      const files = req?.files;
      let ret = [
        files.main[0].filename,
        files.image1[0].filename,
        files.image2[0].filename,
        files.image3[0].filename,
      ];
      const uploaded = await productuploads.create({
        ...productDetails,
        images: ret,
      });
      if (uploaded) {
        res.redirect("/products");
      }
    } catch (error) {
      console.log("An Error happened");
      throw error;
    }
  },

  // -----------------------------------------------Post editProduct-----------------------------------------------------------

  editProduct: async (req, res) => {
    const id = req.params.id;
    const product = await productuploads.findOne({ _id: id });
    res.render("admin/editproduct", { product });
  },

  // -----------------------------------------------Get editProduct-----------------------------------------------------------

  Edit_Product: async (req, res) => {
    const productDetails = req.body;
    const id = req.params.id;
    try {
      const files = req?.files;
      let ret = [
        files.main[0].filename,
        files.image1[0].filename,
        files.image2[0].filename,
        files.image3[0].filename,
      ];
      const uploaded = await productuploads.updateOne(
        { _id: id },
        {
          ...productDetails,
          images: ret,
        }
      );
      if (uploaded) {
        res.redirect("/products");
      }
    } catch (error) {
      console.log("An Error happened");
      throw error;
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

  addBrand: async (req, res) => {
    res.render("admin/addbrand");
  },

  brandAdded: async (req, res) => {
    try {
      const brand = req.body.brandname;
      //adding brand to database
      await Brand.create({ brandName: brand });
      res.redirect("/brands");
    } catch (error) {
      console.log("here is some errors ");
    }
  },

  editBrand: async (req, res) => {
    try {
      //edit brand name
      const id = req.params.id;
      console.log(id);

      const brand = await Brand.findOne({ _id: id });
      res.render("admin/editBrand", { brand, id });
    } catch (error) {
      console.log("an error occured while editing the brands");
    }
  },

  deleteBrand: async (req, res) => {
    try {
      //delete brand name
      const id = req.params.id;
      const brand = await Brand.deleteOne({ _id: id });
      res.redirect("/brands");
    } catch (error) {
      console.log("error occured while deleting brand ");
    }
  },

  uploadBrand: async (req, res) => {
    try {
      const id = req.body.id;
      const brand = req.body.brandname;
      await Brand.updateOne(
        { _id: id },
        {
          $set: {
            brandName: brand,
          },
        }
      );
      res.redirect("/brands");
    } catch (error) {
      console.log("error occured while uploading brand ");
    }
  },

  getCategory: async (req, res) => {
    res.render("admin/addcatagory");
  },

  addCategory: async (req, res) => {
    try {
      const catagory = req.body.catagoryname;
      const catagoryz = await Catagory.find();
      console.log(catagoryz);
      //   .skip((pageNum - 1) * perPage)
      //   .limit(perPage);
      // let i = (pageNum - 1) * perPage;
      console.log('passed');

      const prev = await Catagory.findOne({ catagoryName: catagory });
      if (prev) {
        res.render("admin/catagory", {
          catagoryz,
          i:1,
          err: "catagory already exists"
        });
      } else {
        //adding brand to database
        await Catagory.create({ catagoryName: catagory });
        res.redirect("/catagory");
      }
    } catch (error) {
      console.log("here is some errors ");
    }
  },

  editCatagory: async (req, res) => {
    try {
      //edit brand name
      const id = req.params.id;
      console.log(id);

      const catagory = await Catagory.findOne({ _id: id });
      res.render("admin/editcatagory", { catagory, id });
    } catch (error) {
      console.log("an error occured while editing the catagory");
    }
  },

  deleteCatagory: async (req, res) => {
    try {
      //delete brand name
      const id = req.params.id;
      const catagory = await Catagory.deleteOne({ _id: id });
      res.redirect("/catagory");
    } catch (error) {
      console.log("error occured while deleting catagory");
    }
  },

  uploadCatagory: async (req, res) => {
    try {
      const id = req.body.id;
      const catagory = req.body.catagoryname;
      await Catagory.updateOne(
        { _id: id },
        {
          $set: {
            catagoryName: catagory,
          },
        }
      );
      res.redirect("/catagory");
    } catch (error) {
      console.log("error occured while uploading catagory");
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

  product_Blocking: async (req, res) => {
    //user control (product blocking and unblocking)
    const id = req.params.id;
    const blockData = await productuploads.findOne({ _id: id });
    if (blockData.status == "Active") {
      const blocked = await productuploads.updateOne(
        { _id: id },
        { status: "blocked" }
      );
    } else if (blockData.status == "blocked") {
      const blocked = await productuploads.updateOne(
        { _id: id },
        { status: "Active" }
      );
    }
    res.redirect("/products");
  },
};
