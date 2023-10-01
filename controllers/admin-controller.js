const {
    Brand,
    User,
    Catagory
} = require("../models/model");

module.exports = {
  admin_brands : async (req, res) => {
    const pageNum = req.query.page
    const perPage = 10;
    const brandz = await Brand.find()
    .skip((pageNum - 1) * perPage)
    .limit(perPage)
    let i = ((pageNum - 1) * perPage)+1;
    res.render("admin/brands", { title: "admin brands", brandz, i });
  },
  admin_Users : async (req,res) => {
    const pageNum = req.query.page
    const perPage = 10;
    const userData = await User.find()
    .skip((pageNum - 1) * perPage)
    .limit(perPage)
    let i = ((pageNum - 1) * perPage)+1;
    res.render('admin/userList',{title : 'admin-user list',userData,i});
  },
  admin_catagory : async (req,res) => {
    const pageNum = req.query.page
    const perPage = 10;
    const catagoryz = await Catagory.find()
    .skip((pageNum - 1) * perPage)
    .limit(perPage)
    res.render('admin/catagory',{catagoryz,i})
  }
};
