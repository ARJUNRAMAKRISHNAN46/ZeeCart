const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartModel = new Schema({
  email : {
    type : String
  },
  productId :{
    type : Array
  }
});

const cartModels = mongoose.model('cartmodel',cartModel);
module.exports = cartModels