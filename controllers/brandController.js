const Brand = require("../models/brandModel");

module.exports = {
  admin_brands: async (req, res) => {
    try {
      //creating pagination
      const pageNum = req.query.page;
      const perPage = 3;
      const [dataCount, brandz] = await Promise.all([
        Brand.find().count(),
        Brand.find().skip((pageNum - 1) * perPage).limit(perPage)
      ]);
      let i = (pageNum - 1) * perPage;
      res.render("admin/brands", {
        title: "admin brands",
        brandz,
        i,
        dataCount,
      });
    } catch (error) {
      console.log(error);
    }
  },
  addBrand: async (req, res) => {
    try {
      res.render("admin/addbrand", { err: "" });
    } catch (error) {
      console.log(error);
    }
  },

  brandAdded: async (req, res) => {
    try {
      const brand = req.body.brandname;
      //adding brand to database
      const existBrand = await Brand.findOne({ brandName: brand });
      if (!existBrand) {
        await Brand.create({ brandName: brand });
        res.redirect("/brands?page=1");
      } else {
        res.render("admin/addbrand", { err: "brand already exists..!" });
      }
    } catch (error) {
      console.log(error);
    }
  },

  editBrand: async (req, res) => {
    try {
      //edit brand name
      const id = req.params.id;

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
      res.redirect("/brands?page=1");
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
      res.redirect("/brands?page=1");
    } catch (error) {
      console.log("error occured while uploading brand ");
    }
  },
};
