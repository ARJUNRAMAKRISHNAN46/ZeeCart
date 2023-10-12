const { Users, Brand, Catagory, productuploads } = require("../models/model");
const multer = require("multer");

module.exports = {
  //<---------------------------------------------Brands------------------------------------------------------------->
  admin_brands: async (req, res) => {
    //creating pagination
    const pageNum = req.query.page;
    const perPage = 10;
    const brandz = await Brand.find()
      .skip((pageNum - 1) * perPage)
      .limit(perPage);
    let i = (pageNum - 1) * perPage;
    res.render("admin/brands", { title: "admin brands", brandz, i });
  },
  // <---------------------------------------------Users------------------------------------------------------------->
  admin_Users: async (req, res) => {
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
  },
  // <---------------------------------------------Catagory------------------------------------------------------------->
  admin_catagory: async (req, res) => {
    //creating pagination
    const pageNum = req.query.page;
    const perPage = 10;
    const catagoryz = await Catagory.find()
      .skip((pageNum - 1) * perPage)
      .limit(perPage);
    let i = (pageNum - 1) * perPage;
    res.render("admin/catagory", { catagoryz, i });
  },

  // <---------------------------------------------Product------------------------------------------------------------->
  admin_product: async (req, res) => {
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
  },
  // <---------------------------------------------------------------------------------------------------------->
  product_upload: async (req, res) => {
    res.render("admin/addProducts");
  },
  // -----------------------------------------------Upload Product-----------------------------------------------------------

  editProduct: async (req, res) => {
    const product = await Product.find();
    res.render("admin/admin-editProduct", { product: product[0] });
  },

  // -----------------------------------------------Get addProduct-----------------------------------------------------------

  getAddProduct: (req, res) => {
    res.render("admin/addproduct");
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
        res.redirect("/");
      }
    } catch (error) {
      console.log("An Error happened");
      throw error;
    }
  },

  // -----------------------------------------------Post editProduct-----------------------------------------------------------

  editProduct: async (req, res) => {
    const product = await Product.find();
    res.render("admin/admin-editProduct", { product: product[0] });
  },

  // -----------------------------------------------Get editProduct-----------------------------------------------------------

  Edit_Product: async (req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    console.log(req.files);
    try {
      const id = req.params.id;
      const productType = req.body.productType;

      const variations = [];
      console.log(req.body);
      if (productType === "Tyre") {
        const tyreSize = req.body.Tyre;

        variations.push({ value: tyreSize });
      } else if (productType === "Oil") {
        console.log("inside oil");
        const oilSize = req.body.Oil;
        variations.push({ value: oilSize });
      }
      console.log(variations);
      req.body.Variation = variations[0].value;
      req.body.images = req.files.map((val) => val.filename);
      req.body.Display = "Active";
      req.body.Status = "in Stock";
      req.body.updateOn = new Date();
      const updatingProduct = await Product.findOneAndUpdate(
        { _id: id },
        req.body
      );

      res.redirect("/");
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
    if (email == credential.email && password == credential.password) {
      res.redirect("/products?page=1");
    } else {
      console.log("invalid username or password");
    }
  },
  //admin login page
  adHost: async (req, res) => {
    res.render("admin/login", { err: "" });
  },

  user_Blocking: async (req, res) => {
    //user control (user blocking and unblocking)
    const id = req.params.id;
    const blockData = await Users.findOne({ _id: id });
    if (blockData.statuz == "Active") {
      const blocked = await Users.updateOne({ _id: id }, { statuz: "Blocked" });
    } else if (blockData.statuz == "Blocked") {
      const blocked = await Users.updateOne({ _id: id }, { statuz: "Active" });
    }
    //setting pagination for admin-user controller page
    const pageNum = req.query.page;
    const perPage = 10;
    const userData = await Users.find()
      .skip((pageNum - 1) * perPage)
      .limit(perPage);
    let i = (pageNum - 1) * perPage;

    res.render("admin/userList", { title: "admin-user list", userData, i });
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
      //adding brand to database
      await Catagory.create({ catagoryName: catagory });
      res.redirect("/catagory");
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
};
