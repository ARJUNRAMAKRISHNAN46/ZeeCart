const OTP = require("../models/otpModel");
const { generateOTP } = require("./generateOTP");
const { sendMail } = require("./mail");

module.exports.sendOTP = async (email) => {
  const otp = generateOTP();

  const newotp = await OTP.findOneAndUpdate(
    { email },
    { $set: { otp, isExpired: false } },
    { upsert: true }
  );

  // Configure email options
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  };

  const mailReasponse = await sendMail(mailOptions);

  return {
    mailReasponse,
    newotp,
  };
};
