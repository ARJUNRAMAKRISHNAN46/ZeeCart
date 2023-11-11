// var easyinvoice = require("easyinvoice");
// const fs = require("fs");
// const path = require("path");
// const puppeteer = require("puppeteer");

// function invoiceDownload(orderDetails, addressDetails, orderId) {
//   var data = {
//     customize: {},
//     images: {
//       logo: fs.readFileSync(
//         path.join(__dirname, "..", "public", "assets", "zeecart.png"),
//         "base64"
//       ),
//     },
//     sender: {
//       company: "Zeecart",
//       address: "railway station road",
//       zip: "671313",
//       city: "cheruvathur",
//       district: "kasargod",
//       country: "india",
//     },
//     client: {
//       company: addressDetails[0].address.name,
//       address: addressDetails[0].address.address,
//       zip: addressDetails[0].address.pincode,
//       city: addressDetails[0].address.city,
//       district: addressDetails[0].address.district,
//       country: "india",
//     },
//     information: {
//       number: "2023"+orderId,
//       date: "12-12-2023",
//       "due-date": "31-12-2023",
//     },
//     products: [],

//     "bottom-notice": "Kindly pay your invoice within 15 days.",
//     settings: {
//       currency: "INR",
//     },
//     translate: {},
//   };
//   orderDetails.forEach((order) => {
//     order.products.forEach((product) => {
//       data.products.push({
//         quantity: product.quantity,
//         description: product.productId.ProductName,
//         price: product.productId.Price,
//         "tax-rate": "12%",
//       });
//     });
//   });

//   return new Promise(async (resolve, reject) => {
//     try {
//       const result = await easyinvoice.createInvoice(data);

//       const filePath = path.join(
//         __dirname,
//         "..",
//         "public",
//         "pdf",
//         `${orderId}.pdf`
//       );
//       await writeFileAsync(filePath, result.pdf, "base64");

//       resolve(filePath);
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// }

// module.exports = { invoiceDownload };


const easyinvoice = require('easyinvoice');
const fs = require("fs");
const path = require("path");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

module.exports = {
  order: async (order) => {
    // console.log(order, "utitlity");
  var data = {
            // Customize enables you to provide your own templates
            // Please review the documentation for instructions and examples
            "customize": {
                //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
            },

            "images": {
                // "background": "https://public.easyinvoice.cloud/pdf/sample-background.pdf"
                "logo": fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'zeecart.png'), 'base64'),
                // "background": fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'background', 'your_background.png'), 'base64')
                // "background": "https://public.easyinvoice.cloud/pdf/sample-background.pdf"

            },
            "sender": {
                "company": "ZEECART",
                "address": "NADAKKAVU",
                "zip": "673001",
                "city": "Calicut",
                "country": "Kerala"
            },
            "client": {
                // "company": order.ShippedAddress.Name,
                // "address": order.ShippedAddress.Address,
                // "zip":order.ShippedAddress.Pincode ,
                // "zip": order.ShippedAddress.Pincode,
                // "city": order.ShippedAddress.City,
                // "state":order.ShippedAddress.State,
                // "Mob No":order.ShippedAddress.Mobaile,
                // "state": order.ShippedAddress.State,
                // "Mob No": order.ShippedAddress.Mobaile
            },
            "information": {
                "number": order._id,
                "date": order.OrderedDate,
                "due-date": order.OrderedDate
            },
            "products": order.Items.map((product) => ({
                "quantity": product.Quantity,
                "description": product.ProductId.ProductName, 
                "tax-rate": 0,
                "price": product.ProductId.DiscountAmount
            })),

            "bottom-notice": "Thank You For Your Purchase",
            "settings": {
                "currency": "USD",
                "tax-notation": "vat",
                "currency": "INR",
                "tax-notation": "GST",
                "margin-top": 50,
                "margin-right": 50,
                "margin-left": 50,
                "margin-bottom": 25
            },

        // Translate your invoice to your preferred language
        "translate": {
            // "invoice": "FACTUUR",  // Default to 'INVOICE'
            // "number": "Nummer", // Defaults to 'Number'
            // "date": "Datum", // Default to 'Date'
            // "due-date": "Verloopdatum", // Defaults to 'Due Date'
            // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
            // "products": "Producten", // Defaults to 'Products'
            // "quantity": "Aantal", // Default to 'Quantity'
            // "price": "Prijs", // Defaults to 'Price'
            // "product-total": "Totaal", // Defaults to 'Total'
            // "total": "Totaal", // Defaults to 'Total'
            // "vat": "btw" // Defaults to 'vat'
        }
    }

    //Create your invoice! Easy!

      // Create a Promise to handle the asynchronous file writing
      return new Promise(async (resolve, reject) => {
        try {
            const result = await easyinvoice.createInvoice(data);


            const filePath = path.join(__dirname, '..', 'public', 'pdf', `${order._id}.pdf`);
            await writeFileAsync(filePath, result.pdf, 'base64');

            resolve(filePath);
 } catch (error) {
            console.log(error)
            reject(error);
        }
    });
    }
};