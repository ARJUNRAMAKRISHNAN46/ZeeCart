const { Users, Brand, Catagory, productuploads } = require("../models/model");
const multer = require("multer");

module.exports = {
  //<---------------------------------------------Brands------------------------------------------------------------->
  admin_brands: async (req, res) => {
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
    const pageNum = req.query.page;
    const perPage = 10;
    const userData = await Users.find()
      .skip((pageNum - 1) * perPage)
      .limit(perPage);
    let i = (pageNum - 1) * perPage;
    res.render("admin/userList", { title: "admin-user list", userData, i });
  },
  // <---------------------------------------------Catagory------------------------------------------------------------->
  admin_catagory: async (req, res) => {
    const pageNum = req.query.page;
    const perPage = 10;
    const catagoryz = await Catagory.find()
      .skip((pageNum - 1) * perPage)
      .limit(perPage);
    let i = (pageNum - 1) * perPage;
    res.render("admin/addproduct", { catagoryz, i });
  },
  // <---------------------------------------------Product------------------------------------------------------------->
  admin_product: async (req, res) => {
    res.render("admin/addProduct");
  },
  // <---------------------------------------------------------------------------------------------------------->
  product_upload: async (req, res) => {
    res.render("admin/addProduct");
  },
  // -----------------------------------------------Upload Product-----------------------------------------------------------

  editProduct: async (req, res) => {
    const product = await Product.find();
    res.render("admin/admin-editProduct", { product: product[0] });
  },

  // -----------------------------------------------Get addProduct-----------------------------------------------------------

  getAddProduct: (req, res) => {
    res.render("admin/admin-addProduct");
  },

  // -----------------------------------------------Post addProduct-----------------------------------------------------------

  AddProduct: async (req, res) => {
    const productDetails = req.body;
    try {
      console.log(req.body);
      const uploaded = await productuploads.create({...productDetails,images:req.file.filename});
      if(uploaded){
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
};
