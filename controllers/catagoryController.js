const Catagory = require("../models/catagoryModel");

module.exports = {
  getCategory: async (req, res) => {
    try {
      res.render("admin/addcatagory");
    } catch (error) {
      console.log(error);
    }
  },

  addCategory: async (req, res) => {
    try {
      const catagory = req.body.catagoryname;
      const [categoryz, dataCount, prev] = await Promise.all([
        Catagory.find(),
        Catagory.find().count(),
        Catagory.findOne({ catagoryName: catagory }),
      ]);
      if (prev) {
        res.render("admin/catagory", {
          categoryz,
          i: 1,
          dataCount,
          err: "catagory already exists",
        });
      } else {
        //adding category to database
        await Catagory.create({ catagoryName: catagory });
        res.redirect("/catagory?page=1");
      }
    } catch (error) {
      console.log("here is some errors ");
    }
  },

  editCatagory: async (req, res) => {
    try {
      //edit brand name
      const id = req.params.id;

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
      res.redirect("/catagory?page=1");
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
      res.redirect("/catagory?page=1");
    } catch (error) {
      console.log("error occured while uploading catagory");
    }
  },
  admin_catagory: async (req, res) => {
    try {
      //creating pagination
      const pageNum = req.query.page;
      const perPage = 2;
      const [dataCount, catagoryz] = await Promise.all([
        Catagory.find().count(),
        Catagory.find()
          .skip((pageNum - 1) * perPage)
          .limit(perPage),
      ]);

      let i = (pageNum - 1) * perPage;
      res.render("admin/catagory", { catagoryz, i, dataCount, err: "" });
    } catch (error) {
      console.log(error);
    }
  },
};
