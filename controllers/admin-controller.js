const { Users, Brand, Catagory, productUpload } = require("../models/model");
const multer = require("multer");
const upload = multer({ dest: "product-images/" });

module.exports = {
  upload,
  //<---------------------------------------------Brands------------------------------------------------------------->
  admin_brands: async (req, res) => {
    const pageNum = req.query.page;
    const perPage = 10;
    const brandz = await Brand.find()
      .skip((pageNum - 1) * perPage)
      .limit(perPage);
    let i = (pageNum - 1) * perPage;
    res.render("admin/brands", { title: "admin brands", brandz, i });
  },
  // <---------------------------------------------Users------------------------------------------------------------->
  admin_Users: async (req, res) => {
    const pageNum = req.query.page;
    const perPage = 10;
    const userData = await Users.find()
      .skip((pageNum - 1) * perPage)
      .limit(perPage);
    let i = (pageNum - 1) * perPage;
    res.render("admin/userList", { title: "admin-user list", userData, i });
  },
  // <---------------------------------------------Catagory------------------------------------------------------------->
  admin_catagory: async (req, res) => {
    const pageNum = req.query.page;
    const perPage = 10;
    const catagoryz = await Catagory.find()
      .skip((pageNum - 1) * perPage)
      .limit(perPage);
    let i = (pageNum - 1) * perPage;
    res.render("admin/catagory", { catagoryz, i });
  },
  // <---------------------------------------------Product------------------------------------------------------------->
  admin_product: async (req, res) => {
    res.render("admin/addProduct");
  },
  // <---------------------------------------------------------------------------------------------------------->
  product_upload : async (req,res) => {
    // console.log(req.files['productImage1']);
    // console.log(req.files['productImage2']);
    // const name = req.files.originalname;
    // console.log(name);
    res.render('admin/addProduct')
  },
  // -----------------------------------------------Upload Product-----------------------------------------------------------

  // addProduct: async (req, res) => {
  //   try {
  //     // const main = req.files["main"][0];
  //     // const img2 = req.files["image1"][0];
  //     // const img3 = req.files["image2"][0];
  //     // const img4 = req.files["image3"][0];
  //     // const img5 = req.files["image4"][0];

  //     // Do whatever you want with these files.
  //     console.log("Uploaded files:");
  //     console.log(main);
  //     console.log(img2);
  //     console.log(img3);
  //     console.log(img4);
  //     console.log(img5);
  //     const {
  //       productname,
  //       price,
  //       discount,
  //       brand,
  //       category,
  //       spec1,
  //       spec2,
  //       spec3,
  //       spec4,
  //       description,
  //     } = req.body;

  //     console.log("name is " + productname);

  //     let categoryId = await categoryCollection.find({
  //       categoryname: category,
  //     });
  //     await new productCollection({
  //       productName: productname,
  //       category: new ObjectId(categoryId[0]._id),
  //       price: price,
  //       discount: discount,
  //       image: {
  //         mainimage: main.filename,
  //         // image1: img2.filename,
  //         // image2: img3.filename,
  //         image3: img4.filename,
  //         // image4: img5.filename,
  //       },
  //       brand: brand,
  //       description: description,
  //       addedDate: Date.now(),
  //       specification: {
  //         spec1: spec1,
  //         spec2: spec2,
  //         spec3: spec3,
  //         spec4: spec4,
  //       },
  //     }).save();
  //     let data = await category.find({ categoryname: category });
  //     // console.log(data + " __ this category data");
  //     await category.updateOne(
  //       { categoryname: category },
  //       { $inc: { stock: 1 } }
  //     );
  //     res.render("/");
  //   } catch (err) {
  //     console.log("error found" + err);
  //   }
  // },
};
