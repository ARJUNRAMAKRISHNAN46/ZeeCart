const express = require("express");
require("dotenv").config();
const session = require("express-session");
const router = require("./router.js/userrouter");
const mongoose = require("mongoose");
const routers = require("./router.js/adminrouter");
const flash = require('connect-flash');
const app = express();


app.use((req,res,next)=>{
  res.set("Cache-Control","no-store")
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.static("public"));
app.use(flash());
app.use("/", router);
app.use("/", routers);

mongoose.connect(process.env.MONGO_URI).then(() =>
  app.listen(4000, () => {
    console.log("server running in http://localhost:4000");
  })
);
