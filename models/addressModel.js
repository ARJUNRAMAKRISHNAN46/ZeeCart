const mongoose = require("mongoose");
const { schema } = require("./userModel");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    name : {
        type : String
    },
    mobile : {
        type : String
    },
    email : {
        type : String
    },
    pincode : {
        type : String
    },
    address : {
        type : String
    },
    locality : {
        type : String
    },
    city : {
        type : String
    },
    district : {
        type : String
    },
    state : {
        type : String
    },
})

const Address = mongoose.model('address',addressSchema);
module.exports = Address;