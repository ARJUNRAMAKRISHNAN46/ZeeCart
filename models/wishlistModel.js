const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
  },
   products: [{
    productId: {
      type: Schema.Types.ObjectId,ref : 'productUploads'
    },
  }],
});

const wishlistModels = mongoose.model("wishlist", wishlistSchema);
module.exports = wishlistModels;
