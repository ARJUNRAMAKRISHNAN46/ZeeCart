const product = require("../models/productModel");
const offer = require("../models/offerModel");
const cron = require("node-cron");
const Category = require("../models/catagoryModel");

const checkOffer = async () => {
  try {
    const currentDate = new Date();
    const offers = await offer.find({ expiryDate: { $lte: currentDate } });
    if (offers.length > 0) {
      for (const off of offers) {
        const categoryname = await Category.findOne({
          catagoryName: off.Catagory,
        });
        const categoryName = categoryname.catagoryName;
        const previousDiscounts = {};
        const productsToUpdate = await product.find({ Category: categoryName });

        productsToUpdate.forEach((product) => {
          previousDiscounts[product._id] = product.DiscountAmount;
        });

        const discountAmounts = off.discount;

        const discountAmount =
          productsToUpdate[0].beforeOffer * (discountAmounts / 100);

        const products = await product.updateMany(
          { Category: categoryName },
          {
            $inc: { DiscountAmount: discountAmount },
            $set: {
              IsInCategoryOffer: false,
              categoryOffer: undefined,
            },
          }
        );

        await offer.deleteOne({ _id: off._id });
      }
    }
  } catch (error) {
    console.error("Error in the cron job:", error);
    throw error;
  }
};

cron.schedule("*/10 * * * * *", async () => {
  try {
    await checkOffer();
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
// ---------------------------------------------------------------------------------------------------------------->
// const offer = require("../models/offerModel");
// const products = require("../models/productModel");
// const cron = require("node-cron");

// async function checkOffer() {
//   const offers = await offer
//     .find({ Catagory: "IOS MOBILES" })
//     .maxTimeMS(30000);

//   if (offers?.length === 0) {
//     console.log("No offers found.");
//     return;
//   } else {
//     const expiryDateString = offers[0]?.expiryDate;
//     const currentDate = new Date();
//     const formattedDate = currentDate.toISOString().split("T")[0];
//     const value = Number(100 - offers?.discount);
//     const offerId = offers[0]?._id;

//     const category = offers[0]?.Catagory;
//     if (expiryDateString > formattedDate) {
//       console.log("offer exists");
//     } else {
//       console.log("offer expired");
//       const proData = await products.updateMany(
//         { Category: category },
//         {
//           $mul: { DiscountAmount: 100 / value },
//         }
//       );
//       const del = await offer.findByIdAndDelete({ _id: offerId });
//     }
//   }
// }
// cron.schedule("*/10 * * * * *", async () => {
//   try {
//     await checkOffer();
//   } catch (error) {
//     console.error("Error in cron job:");
//   }
// });
// module.exports = { checkOffer };
