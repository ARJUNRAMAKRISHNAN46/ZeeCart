var easyinvoice = require("easyinvoice");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

function invoiceDownload(orderDetails, addressDetails, orderId) {
  var data = {
    customize: {},
    images: {
      logo: fs.readFileSync(
        path.join(__dirname, "..", "public", "assets", "zeecart.png"),
        "base64"
      ),
    },
    sender: {
      company: "Zeecart",
      address: "railway station road",
      zip: "671313",
      city: "cheruvathur",
      district: "kasargod",
      country: "india",
    },
    client: {
      company: addressDetails[0].address.name,
      address: addressDetails[0].address.address,
      zip: addressDetails[0].address.pincode,
      city: addressDetails[0].address.city,
      district: addressDetails[0].address.district,
      country: "india",
    },
    information: {
      number: "2023"+orderId,
      date: "12-12-2023",
      "due-date": "31-12-2023",
    },
    products: [],

    "bottom-notice": "Kindly pay your invoice within 15 days.",
    settings: {
      currency: "INR",
    },
    translate: {},
  };
  orderDetails.forEach((order) => {
    order.products.forEach((product) => {
      data.products.push({
        quantity: product.quantity,
        description: product.productId.ProductName,
        price: product.productId.Price,
        "tax-rate": "12%",
      });
    });
  });

  return new Promise(async (resolve, reject) => {
    try {
      const result = await easyinvoice.createInvoice(data);

      const filePath = path.join(
        __dirname,
        "..",
        "public",
        "pdf",
        `${orderId}.pdf`
      );
      await writeFileAsync(filePath, result.pdf, "base64");

      resolve(filePath);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

module.exports = { invoiceDownload };
