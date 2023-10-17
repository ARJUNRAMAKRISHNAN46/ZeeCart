const Brand = require("../models/brandModel");

module.exports = {
  admin_brands: async (req, res) => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  },
  addBrand: async (req, res) => {
    try {
      res.render("admin/addbrand");
    } catch (error) {
      console.log(error);
    }
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
};
