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

  address: {
    houseName: String,
    locality: String,
    city: String,
    district: String,
    state: String,
    pincode: String,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  expectedDeliveryDate: Date,
  paymentMethod: String,
  PaymentStatus: String,
  totalAmount: Number,
  deliveryDate: Date,
  orderStatus: String,
  couponDiscount: String,
  couponCode: String,
  discountAmount: String,
});

const orderModels = mongoose.model("order", orderSchema);
module.exports = orderModels;
