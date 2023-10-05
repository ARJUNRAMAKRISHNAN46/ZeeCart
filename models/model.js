const mongoose = require('mongoose');

const Schema = mongoose.Schema
//user schema
const userschema = new Schema({
    name : {
        type : String
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        type : String
    }
},
{
    timestamps : true
})

//brand schema
const brandSchema = new Schema({
    brandName : {
        type : String
    }
})
//catagory schema
const catagorySchema = new Schema({
    catagoryName : {
        type : String
    }
}) 
//product upload schema 
const productUploadSchema = new Schema({
    ProductName: {
        type: String,
        required: true,
      },
      Price: {
        type: Number,
        required: true,
      },
      Description: {
        type: String,
        required: true,
      },
      BrandName: {
        type: String,
        required: true,
      },
      Tags: {
          type: Array,
      },
      images: {
        type: String,
        required: true,
      },
      AvailableQuantity: {
        type: Number,
        required: true,
      },
      Category: {
        type: String,
        required: true,
      },
      DiscountAmount: {
        type: Number,
      },
    //   Status: {
    //     type: String,
    //     required: true
    //   },
      UpdatedOn: {
        type: Date
      },
    //   Display: {
    //     type: String,
    //     required: true
    //   },
      Specification1: {
        type: String
      },
      Specification2: {
        type: String
      },
      Specification3: {
        type: String
      },
      Specification4: {
        type: String
      }
   
})



const Users = mongoose.model('User',userschema);
const Brand = mongoose.model('Brand',brandSchema);
const Catagory = mongoose.model('Catagory',catagorySchema);
const productuploads = mongoose.model('productUpload',productUploadSchema);

module.exports = {
    Users,
    Brand,
    Catagory,
    productuploads
}
