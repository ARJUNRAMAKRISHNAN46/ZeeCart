const Razorpay = require("razorpay");
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

var instance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

const createOrder = async (req, res) => {
  try {
    const total = req.session.grandTotal;
    var options = {
      amount: total,
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    instance.orders.create(options, function (err, order) {
      if (err) {
        console.error(err);
        res.status(500).send("Error in creating order");
      } else {
        console.log(order,'orderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
        res.json({success:true, order});
      }
    });
  } catch (error) {}
};
module.exports = {
  createOrder
}