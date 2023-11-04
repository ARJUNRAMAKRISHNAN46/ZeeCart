const coupon = require("../models/couponModel");
let couponAmount;
module.exports = {
  admin_coupon: async (req, res) => {
    try {
      const coupons = await coupon.find();
      console.log(coupons,'hhhhhhhhhhhhhhhhhh');
      res.render("admin/coupon",{ coupons,err : '' });
    } catch (error) {
      console.log(error);
    }
  },
  addCoupon:async(req,res) => {
    try {
        console.log(req.body,'-----------------------------------------');
        const existCoupon = await coupon.find({
            coupons: [
                {
                    couponCode: req.body.couponCode
                },
              ],
        })
        console.log(existCoupon);
        console.log( req.body.couponCode,
           req.body.description,
            req.body.expiryDate,);
        if(!existCoupon[0]) {
            await coupon.create(
                req.body      
              );
        }else{
            const coupons = await coupon.find();
            res.render("admin/coupon",{ coupons ,err : 'coupon already exists..!'});
        }
        res.redirect('/coupon');
    } catch (error) {
        console.log(error);
    }
  },
  
};6