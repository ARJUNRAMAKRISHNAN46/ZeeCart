var easyinvoice = require("easyinvoice");
const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');

function createInvoice() {

  var data = {
      "customize": {
      },
      "images": {
          "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
          "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
      },
      "sender": {
          "company": "Sample Corp",
          "address": "Sample Street 123",
          "zip": "1234 AB",
          "city": "Sampletown",
          "country": "Samplecountry"
        
      },
      "client": {
          "company": "Client Corp",
          "address": "Clientstreet 456",
          "zip": "4567 CD",
          "city": "Clientcity",
          "country": "Clientcountry"
      },
      "information": {
          "number": "2021.0001",
          "date": "12-12-2021",
          "due-date": "31-12-2021"
      },
      "products": [
          {
              "quantity": 2,
              "description": "Product 1",
              "tax-rate": 6,
              "price": 33.87
          },
          {
              "quantity": 4.1,
              "description": "Product 2",
              "tax-rate": 6,
              "price": 12.34
          },
          {
              "quantity": 4.5678,
              "description": "Product 3",
              "tax-rate": 21,
              "price": 6324.453456
          }
      ],
      "bottom-notice": "Kindly pay your invoice within 15 days.",
      "settings": {
          "currency": "INR",
      },
      "translate": {

      },
  };

  easyinvoice.createInvoice(data, function (result) {
      //The response will contain a base64 encoded PDF file
      // console.log('PDF base64 string: ', result.pdf);
      easyinvoice.download('myInvoice.pdf', result.pdf);
  });
}