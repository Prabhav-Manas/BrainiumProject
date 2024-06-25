const express = require("express");
const router = express.Router();
const multer = require("multer");
const ProductController = require("../controllers/product");

// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpg",
//   "image/jpg": "jpg",
// };

// Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("invalid mime type");
//     if (isValid) {
//       error = null;
//     }
//     cb(error, "backEndApp/images");
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname.toLowerCase().split(" ").join("-");
//     const ext = MIME_TYPE_MAP[file.mimetype];
//     cb(null, `${name}-${Date.now()}.${ext}`);
//   },
// });

// const upload = multer({ storage: storage });
// upload.array("images"),

router.post("/add-product", ProductController.addProduct);

router.get("/all-products", ProductController.getProducts);

router.get("/:id", ProductController.getSingleProduct);

router.put("/:id", ProductController.updateProduct);

router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
