const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//product upload schema
const categoryPriceSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "productUploads" },
  offerPrice : String,
});

const categoryPrice = mongoose.model("categoryPrice", categoryPriceSchema);
module.exports = categoryPrice;
