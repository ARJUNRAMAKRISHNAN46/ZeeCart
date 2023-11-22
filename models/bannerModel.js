const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//brand schema
const bannerSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Banner = mongoose.model("banner", bannerSchema);
module.exports = Banner;
