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


const User = mongoose.model('Users',userschema);
const Brand = mongoose.model('Brand',brandSchema);
const Catagory = mongoose.model('Catagory',catagorySchema);
module.exports = {
    User,
    Brand,
    Catagory
}
