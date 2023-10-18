const products = require("../models/productModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");

// const {ObjectId} = require("mongodb");

module.exports = {
  admin_product: async (req, res) => {
    try {
      if (req.session.logged) {
        res.redirect("/dashboard");
      } else {
        //creating pagination
        const pageNum = req.query.page;
        const perPage = 10;
        const productDetails = await products
          .find()
          .skip((pageNum - 1) * perPage)
          .limit(perPage);
        const i = (pageNum - 1) * perPage;
        console.log(productDetails);

        res.render("admin/products", { productDetails, i });
      }
    } catch (error) {
      console.log(error);
    }
  },
  // <---------------------------------------------------------------------------------------------------------->
  product_upload: async (req, res) => {
    try {
      res.render("admin/addProducts");
    } catch (error) {
      console.log(error);
    }
  },

  // -----------------------------------------------Get addProduct-----------------------------------------------------------

  getAddProduct: (req, res) => {
    try {
      res.render("admin/new");
    } catch (error) {
      console.log(error);
    }
  },

  // -----------------------------------------------Post addProduct-----------------------------------------------------------

  addProduct: async (req, res) => {
    try {
      const productDetails = req.body;
      const files = req?.files;
      let ret = [
        files.main[0].filename,
        files.image1[0].filename,
        files.image2[0].filename,
        files.image3[0].filename,
      ];
      const uploaded = await products.create({
        ...productDetails,
        images: ret,
      });
      if (uploaded) {
        res.redirect("/products");
      }
    } catch (error) {
      console.log("An Error happened");
      throw error;
    }
  },

  // -----------------------------------------------Post editProduct-----------------------------------------------------------

  getEditProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const product = await products.findOne({ _id: id });
      res.render("admin/editproduct", { product });
    } catch (error) {
      console.log(error);
    }
  },

  // -----------------------------------------------Get editProduct-----------------------------------------------------------

  editProduct: async (req, res) => {
    try {
      const productDetails = req.body;
      const id = req.params.id;
      const files = req?.files;
      let ret = [
        files.main[0].filename,
        files.image1[0].filename,
        files.image2[0].filename,
        files.image3[0].filename,
      ];
      const uploaded = await products.updateOne(
        { _id: id },
        {
          ...productDetails,
          images: ret,
        }
      );
      if (uploaded) {
        res.redirect("/products");
      }
    } catch (error) {
      console.log("An Error happened");
      throw error;
    }
  },
  //user control (product blocking and unblocking)
  product_Blocking: async (req, res) => {
    try {
      const id = req.params.id;
      const blockData = await products.findOne({ _id: id });
      if (blockData.status == "Active") {
        const blocked = await products.updateOne(
          { _id: id },
          { status: "blocked" }
        );
      } else if (blockData.status == "blocked") {
        const blocked = await products.updateOne(
          { _id: id },
          { status: "Active" }
        );
      }
      res.redirect("/products");
    } catch (error) {
      console.log(error);
    }
  },
  productSpec: async (req, res) => {
    try {
      const id = req.params.id;
      //fetching product details
      const prodSpec = await products.findById(id);
      let i = 0;
      res.render("user/productSpec", { prodSpec, i });
    } catch (error) {
      console.log(error);
    }
  },
  //product list for user
  productList: async (req, res) => {
    try {
      const imgs = await products.find();
      res.render("user/shop", { imgs });
    } catch (error) {
      console.log(error);
    }
  },
  Cart: async (req, res) => {
    try {

      const data = await Cart.find();
      const email = req.session.email;
      console.log(email);
      const user = await User.findOne({ email: email });
      console.log("user" + user._id);
      const userId = user._id;
      console.log(data + "cart");
      // const userId = req.session.email;
      // const user = req.session.name; 
      const cart = await Cart.findOne({ userId: userId }).populate(
        "products.productId"
      );
      const cartData = cart.products;
      console.log(cartData, "============================");
      console.log(cartData[0].productId, "============================");
      console.log(cartData);

      res.render("user/cart", { user, cartData });
      // res.render("user/cart");
    } catch (error) {
      console.log("error");
    }
  },
  // addToCart: async (req, res) => {
  //   try {
  //     const email = req.session.email;
  //     const id = req.params.id;
  //     const user = await Cart.find({ email });
  //     if (user) {
  //       await Cart.updateOne({ userId: email }, { $push: { productId: id , quantity : 1}});
  //       console.log("success ");
  //       // await Cart.insert({email : email},{$push : {productId : id}});
  //     } else {
  //       const insert=await Cart.insert(
  //         [
  //             {
  //               userId : email,
  //                 products:[
  //                     {
  //                         productId:productId,
  //                         quantity:1,
  //                     }
  //                 ]
  //             }
  //         ]
  //     )
  // await Cart.create({ email: email, productId: id });
  // }
  // const data = [
  //   {
  //     $lookup: {
  //       from: "products",
  //       localField: "_id",
  //       foreignField: "productId",
  //       as: "productInfo",
  //     },
  //   },
  // ];
  // const result = await Cart.aggregate(data);
  // console.log('result'+result);
  //   } catch (error) {
  //     console.log("error in cart");
  //   }
  // },
  addToCart: async (req, res) => {
    try {
      const email = req.session.email;
      console.log(email);
      const user = await User.findOne({ email: email });
      console.log("user" + user._id);
      const userId = user._id;
      // console.log(req.session.userid);
      const productId = req.params.id;
      console.log(productId);
      const userData = await Cart.findOne({ userId: userId });
      console.log(userData);

      if (userData !== null) {
        console.log("if");

        const existingCart = userData.products.find((item) =>
          item.productId.equals(productId)
        );
        if (existingCart) {
          existingCart.quantity += 1;
        } else {
          userData.products.push({ productId: productId, quantity: 1 });
        }
        await userData.save();
        req.flash("msg", "Item added to the cart");
        res.redirect("/cart");
      } else {
        console.log("else");
        const newCart = new Cart({
          userId: userId,
          products: [{ ProductId: productId, Quantity: 1 }],
        });
        console.log(newCart);
        await newCart.save();
        req.flash("msg", "Item added to the cart");
        res.redirect("/cart");
      }
    } catch (err) {
      console.log(
        err,
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      );
      req.flash("errmsg", "sorry at this momment we can't reach");
      res.redirect("/cart");
    }
  },
};

// const cartData = await Cart.aggregate([
//   $lookup : {from : 'products',localField : ''}
// ])
// const id = req.params.id;
//       console.log(id);
//       const cartData = await Cart.find({ _id: id });
//       if (cartData) {
//         const data = await products.find({ _id: id });
//         console.log(data);
//         res.render("user/cart", { data });
//       } else {
//         await Cart.create({ _id: id });
//         const data = await products.find({ _id: id });
//         console.log(data);
//         res.render("user/cart", { data });
//       }
//     } catch (error) {
//       console.log("error at line number 163");

// const isExist = await CART.findOne({ "item.productId": productId })
// console.log(isExist);
// if(isExist){
//     await CART.updateOne(
//         {
//             userId
//         },
//         {

//                 products:{
//                     productId:productId,
//                     quantity:1
//                 }

//         }
//     );
// }
// else{
//     await CART.updateOne(
//         {
//             userId
//         },
//         {
//             $push:{
//                 products:{
//                     productId:productId,
//                     quantity:1
//                 }
//             }
//         }
//     );
// }

//

//
// const insert = await Cart.insertMany([
//   {
//     userId: userId,
//     products: [
//       {
//         productId: productId,
//         quantity: 1,
//       },
//     ],
//   },
// ]);
