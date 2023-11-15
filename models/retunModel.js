const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const retutnItemSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  orderId: { type: Schema.Types.ObjectId },
  returnReason: {
    type: String,
  },
  description: {
    type: String,
  },
});

const returnItem = mongoose.model("returnItem", retutnItemSchema);
module.exports = returnItem;
