const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "productUploads",
      },
      quantity: Number,
    },
  ],
  
  address:Array,
  OrderDate: {
    type:Date,
    required : true,
  },
  ExpectedDeliveryDate: Date,
  paymentMethod: String,
  PaymentStatus:String,
  totalAmount: Number,
  deliveryDate: Date,
  orderStatus: String,
});

const orderModels = mongoose.model("order", orderSchema);
module.exports = orderModels;
