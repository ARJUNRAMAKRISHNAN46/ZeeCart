const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    Catagory : String,
    discount : String,
    expiryDate : String,
})

const offer = mongoose.model('offer',offerSchema);
module.exports = offer;