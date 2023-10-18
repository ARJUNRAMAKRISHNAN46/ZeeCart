const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//user schema
const userschema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    statuz: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("User", userschema);
module.exports = Users;
