const products = require("../models/productModel");
const Cart = require("../models/cartModel");

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
  product_Blocking: async (req, res) => {
    //user control (product blocking and unblocking)
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
      console.log(data + "cart");

      res.render("user/cart");
    } catch (error) {
      console.log("error");
    }
  },
  addToCart: async (req, res) => {
    try {
      const email = req.session.email;
      const id = req.params.id;
      const user = await Cart.find({ email });
      if (user) {
        await Cart.updateOne({ email: email }, { $push: { productId: id } });
        console.log("success ");
        // await Cart.insert({email : email},{$push : {productId : id}});
      } else {
        await Cart.create({ email: email, productId: id });
      }
      const data = [
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "productId",
            as: "productInfo",
          },
        },
      ];
      const result = await Cart.aggregate(data)
      console.log('result'+result);
    } catch (error) {
      console.log("error in cart");
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
