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
      let wishData = [];
      const Wishlist = await wishlist
        .find({ userId: userId })
        .populate("products.productId");
      if (Wishlist.length > 0) {
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
      const wishData = await products.updateOne(
        { _id: productId },
        { $set: { inWish: true } }
      );

      const data = await wishlist.findOne({ userId: userId });

      if (data == null) {
        const wishData = await wishlist.create({
          userId: userId,
          products: [{ productId: productId }],
        });
      } else {
        const productInWish = data.products.find(
          (product) => product.productId.toString() === productId
        );

        if (!productInWish) {
          await wishlist.updateOne(
            { userId: userId },
            {
              $addToSet: {
                products: {
                  productId: productId,
                },
              },
            }
          );
        }
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
