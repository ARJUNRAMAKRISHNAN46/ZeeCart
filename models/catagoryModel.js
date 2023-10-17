const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//catagory schema
const catagorySchema = new Schema({
  catagoryName: {
    type: String,
  },
});

const Catagory = mongoose.model("Catagory", catagorySchema);
module.exports = Catagory;
