const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userOTPVerificationschema = new schema({
    uesrId : String,
    otp : String,
    createdDate : Date,
    expiresAt : Date
})
const userOTPVerification = mongoose.model(
    'userOTPVerification',
    userOTPVerificationschema
);

module.exports = userOTPVerification;