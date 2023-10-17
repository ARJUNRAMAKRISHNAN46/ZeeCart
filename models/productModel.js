const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//product upload schema
const productSchema = new Schema({
  ProductName: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  BrandName: {
    type: String,
    required: true,
  },
  Tags: {
    type: Array,
  },
  images: {
    type: Array,
    required: true,
  },
  AvailableQuantity: {
    type: Number,
    required: true,
  },
  Category: {
    type: String,
    required: true,
    unique: true,
  },
  DiscountAmount: {
    type: Number,
  },
  status: {
    type: String,
  },
  UpdatedOn: {
    type: Date,
  },
  Specification1: {
    type: String,
  },
  Specification2: {
    type: String,
  },
  Specification3: {
    type: String,
  },
  Specification4: {
    type: String,
  },
  status: {
    type: String,
  },
});

const products = mongoose.model("productUploads", productSchema);
module.exports = products;
