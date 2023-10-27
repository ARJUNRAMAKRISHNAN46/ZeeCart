const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//brand schema
const brandSchema = new Schema({
  brandName: {
    type: String,
  },
  timeStamp: {
    type: Date,
  },
});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
