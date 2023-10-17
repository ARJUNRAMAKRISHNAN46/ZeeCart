const Address = require("../models/addressModel");

module.exports = {
  //get user profile page
  Profile: async (req, res) => {
    try {
      let email = req.session.email;
      console.log(email);
      let data = await Address.findOne({ email });
      res.render("user/profile", { data });
    } catch (error) {
      console.log(error);
    }
  },
  //getting user address adding page
  getAddAddress: async (req, res) => {
    try {
      res.render("user/addAddress");
    } catch (error) {
        console.log(error);
    }
  },
  //adding new user address
  addAddress: async (req, res) => {
    try {
      console.log(req.body);
      await Address.create(req.body);
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  },
};
