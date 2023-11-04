const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponSchema = {
  userId: {
    type: Schema.Types.ObjectId,
  },
  couponCode: String,
  description: String,
  maxPurchasetAmount: String,
  discountAmount: String,
  startDate : String,
  expiryDate: String,
  
};

const coupon = mongoose.model("coupon", couponSchema);
module.exports = coupon;
