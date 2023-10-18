const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  products: [{
     productId: { type: Schema.Types.ObjectId,ref : 'productUploads' },
     quantity: { type: Number },
  }],
});

const cartModels = mongoose.model('cart',cartSchema);
module.exports = cartModels