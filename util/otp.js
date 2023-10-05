const OTP = require("../models/otpModel");
const { generateOTP } = require("./generateOTP");
const { sendMail } = require("./mail");

// module.exports.sendOTP = async (email) => {
//   const otp = generateOTP();

//   const newotp = await OTP.findOneAndUpdate(
//     { email },
//     { $set: { otp, isExpired: false } },
//     { upsert: true }
//   );

//   // Configure email options
//   const mailOptions = {
//     from: process.env.MAIL_FROM,
//     to: email,
//     subject: "OTP Verification",
//     text: `Your OTP is: ${otp}`,

//   };
//   console.log("final   "+otp);
//   oTp=otp
//   const mailReasponse = await sendMail(mailOptions);

//   return {
//     mailReasponse,
//     newotp
//   };
// }

async function sendOTP(email, req) {
  const otp = generateOTP();
  // req.session.otp = otp;

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
  console.log("final   " + otp);
  oTp = otp;
  const mailReasponse = await sendMail(mailOptions);

  return {
    mailReasponse,
    newotp,
    otp,
  };
}
module.exports = {
  sendOTP,
};
