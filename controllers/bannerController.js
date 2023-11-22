const Banner = require("../models/bannerModel");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

module.exports = {
  admin_banners: async (req, res) => {
    try {
      const banners = await Banner.find();
      res.render("admin/banners", { banners });
    } catch (error) {
      console.log(error);
    }
  },
  addBanner: async (req, res) => {
    try {
      console.log(req.body, req.file);
      let title = req.body.title;
      let imagePath = `/banner-images/${req.file.filename}`;
      let image = req.file;
      const supportedFormats = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
        "image/tiff",
        "image/avif",
      ];

      console.log(image.mimetype, "-------------------------------->");
      console.log(image, "path-------------------------------->");
      if (!supportedFormats.includes(image.mimetype)) {
        console.log("Unsupported image format");
        return res.redirect("/banners");
      }

      const imageBuffer = fs.readFileSync(image.path);

      const croppedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 750, height: 279, fit: sharp.fit.cover })
        .toBuffer();
      console.log(
        croppedImageBuffer,
        "image cropp image success................................"
      );
      const savePath = path.join(
        __dirname,
        "../public/banner-images/cropped_images"
      );
      const fileName = image.originalname;
      fs.writeFileSync(path.join(savePath, fileName), croppedImageBuffer);

      await new Banner({
        title: title,
        image: fileName,
      }).save();

      res.redirect("/banners");
    } catch (error) {
      console.log(error);
    }
  },
  deleteBanner: async (req, res) => {
    try {
      const bannerId = req.query.bannerId;
      console.log(bannerId);
      const deleteBan = await Banner.findByIdAndDelete(bannerId);
      res.json({
        status : true,
        msg : 'banner delete successfully'
      })
    } catch (error) {
      res.json({
        status : false,
        msg : 'error occured while deleting the banner'
      })
      console.log(error);
    }
  },
};
