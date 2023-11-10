const offer = require("../models/offerModel");
const products = require("../models/productModel");
const cron = require("node-cron");

async function checkOffer() {
  const offers = await offer
    .find({ Catagory: "FLAGSHIP MOBILES" })
    .maxTimeMS(30000);

  if (offers.length === 0) {
    console.log("No offers found.");
    return;
  } else {
    const expiryDateString = offers[0].expiryDate;
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const value = Number(100 - offers.discount);
    const offerId = offers[0]._id;

    const category = offers[0].Catagory;
    if (expiryDateString > formattedDate) {
      console.log("offer exists");
    } else {
      console.log("offer expired");
      const proData = await products.updateMany(
        { Category: category },
        {
          $mul: { DiscountAmount: 100 / value },
        }
      );
      const del = await offer.findByIdAndDelete({ _id: offerId });
    }
  }
}
cron.schedule("*/10 * * * * *", async () => {
  try {
    await checkOffer();
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
module.exports = { checkOffer };
