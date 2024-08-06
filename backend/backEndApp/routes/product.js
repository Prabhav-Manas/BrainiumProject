const express = require("express");
const router = express.Router();
const multer = require("multer");
const authenticateUser = require("../middlewares/auth");
const truncateDescription = require("../middlewares/truncateDescription");
const ProductController = require("../controllers/product");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  // "image/gif": "gif",
  // "image/svg+xml": "svg",
  // "application/octet-stream": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (!isValid) {
      error = null;
    }
    cb(error, "backEndApp/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "/add-product",
  multer({ storage: storage }).single("images"),
  authenticateUser,
  truncateDescription,
  ProductController.addProduct
);

router.get(
  "/all-products",
  authenticateUser,
  truncateDescription,
  ProductController.getProducts
);

router.get(
  "/:id",
  authenticateUser,
  truncateDescription,
  ProductController.getSingleProduct
);

router.put(
  "/:id",
  authenticateUser,
  truncateDescription,
  ProductController.updateProduct
);

router.delete("/:id", authenticateUser, ProductController.deleteProduct);

module.exports = router;
