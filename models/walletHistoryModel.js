const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//brand schema
const walletHistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
  },
  refund: [
    {
      amount: { type: Number },
      reason: { type: String },
      type: { type: String },
      date: { type: Date },
    },
  ],
});

const WalletHistory = mongoose.model("walletHistory", walletHistorySchema);
module.exports = WalletHistory;
