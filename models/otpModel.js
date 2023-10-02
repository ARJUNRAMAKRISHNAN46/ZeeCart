const mongoose = require('mongoose');
const Schema = mongoose.Schema

// 2-10-23 10:40 AM 
const otpSchema = new Schema({
    email : {
        type : String,
        unique : true
    },
    otp : {
        type : String
    },
    isExpired : {
        type : Boolean,
        default : false
    }
},
{
    timestamps : true
})
const OTP = mongoose.model('OTP',otpSchema);
module.exports = OTP;