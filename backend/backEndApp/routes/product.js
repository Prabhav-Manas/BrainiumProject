const express = require("express");
const router = express.Router();
const multer = require("multer");
const truncateDescription = require("../middlewares/truncateDescription");
// const upload = require("../middlewares/multer");
const ProductController = require("../controllers/product");

// const truncateDescription = (req, res, next) => {
//   if (req.body.description && req.body.description.length > 300) {
//     req.body.description = req.body.description.substring(0, 300) + "...";
//   }
//   next();
// };

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "application/octet-stream": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    if (!isValid) {
      const error = new Error("Invalid MIME Type");
      return cb(error);
    }
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "/add-product",
  multer({ storage: storage }).array("images", 5),
  truncateDescription,
  ProductController.addProduct
);

router.get("/all-products", truncateDescription, ProductController.getProducts);

router.get("/:id", truncateDescription, ProductController.getSingleProduct);

router.put("/:id", truncateDescription, ProductController.updateProduct);

router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
