const Address = require("../models/addressModel");

module.exports = {
  //get user profile page
  Profile: async (req, res) => {
    try {
      let email = req.session.email;
      let data = await Address.find({ email });
      const i = 1;
      res.render("user/profile", { data, i });
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
      await Address.create(req.body);
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  },
  //get edit address
  getEditAddress: async (req, res) => {
    try {
      const addressId = req.params.id;
      const address = await Address.findOne({ _id: addressId });
      res.render("user/editAddress", { address });
    } catch (error) {
      console.log(error);
    }
    await Address.updateOne();
  },
  //post edit address 
  postEditAddress: async (req, res) => {
    try {
      const {
        id,
        name,
        mobile,
        email,
        pincode,
        address,
        locality,
        city,
        district,
        state,
      } = req.body;

      await Address.updateOne(
        { _id: id },
        {
          name: name,
          mobile: mobile,
          email: email,
          pincode: pincode,
          address: address,
          locality: locality,
          city: city,
          district: district,
          state: state,
        }
      );
      res.redirect("/profile");
    } catch (error) {}
  },
  //deleting address from user profile
  deleteAddress: async (req, res) => {
    try {
      const addressId = req.params.id;
      await Address.deleteOne({ _id: addressId });
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  },
  //placing order
  placeOrder : async (req,res) => {
    try {
      let email = req.session.email;
      let address = await Address.find({ email });
      res.render('user/selectAddress',{ address });
    } catch (error) {
      console.log(error);
    }
  },
  //confirm user address
  confirmAddress:async(req,res) => {
   try {
    const addressId = req.body.id;
    const address = await Address.find({_id : addressId});
    res.render('user/paymentMethod',{ address });
   } catch (error) {
    console.log(error);
   }
  },

  // confirmPayment:async(req,res)=>{
  //   try {
  //     res.render('user/paymentSuccess');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
};
