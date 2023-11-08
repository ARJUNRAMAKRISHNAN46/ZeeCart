const wishlist = require("../models/wishlistModel");
const User = require("../models/userModel");
const products = require("../models/productModel");

module.exports = {
  wishList: async (req, res) => {
    try {
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      let err = "";
      const Wishlist = await wishlist
        .find({ userId: userId })
        .populate("products.productId");
      if (Wishlist) {
        wishData = Wishlist[0].products;
      } else {
        err = "No Items in wishlist..!";
      }
      res.render("user/wishlist", { wishData, err });
    } catch (error) {
      console.log(error);
    }
  },
  addToWishlist: async (req, res) => {
    try {
      const page = req.query.page;
      const email = req.session.email;
      const user = await User.findOne({ email: email });
      const userId = user._id;
      const productId = req.params.id;
      console.log(productId);
      const wishData = await products.updateOne(
        { _id: productId },
        { $set: { inWish: "true" } }
      );
      console.log(wishData);
      const data = await wishlist.findOne({ userId: userId });
      if (data == null) {
        const wishData = await wishlist.create({
          userId: userId,
          products: [{ productId: productId }],
        });
      } else {
        await wishlist.updateOne(
          { userId: userId },
          {
            $addToSet: {
              products: {
                productId: [productId],
              },
            },
          }
        );
      }
      res.json({
        success: true,
      });
    } catch (error) {
      console.log(error);
    }
  },
  removeFromWishlist: async (req, res) => {
    try {
      const email = req.session.email;
      const userData = await User.find({ email: email });
      const productId = req.params.id;
      const wishData = await products.updateOne(
        { _id: productId },
        { $set: { inWish: "false" } }
      );
      await wishlist.updateOne(
        { userId: userData[0]._id },
        {
          $pull: {
            products: {
              productId: productId,
            },
          },
        }
      );
      res.json({
        success: true,
      });
    } catch (error) {
        res.json({
            success: false,
          });
    }
  },
};
