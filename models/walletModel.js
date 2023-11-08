const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  wallet: {
    type: Number,
  },
});

const wallet = mongoose.model("wallet", walletSchema);
module.exports = wallet;
