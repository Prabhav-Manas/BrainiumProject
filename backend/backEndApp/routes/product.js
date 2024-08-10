const express = require("express");
const router = express.Router();
const multer = require("multer");
const authenticateUser = require("../middlewares/auth");
const truncateDescription = require("../middlewares/truncateDescription");
const ProductController = require("../controllers/product");
const path = require("path");
const { validate } = require("express-validation");
const {
  addProductValidation,
  updateProductValidation,
  // getProductValidation,
  // getSingleProductValidation,
  // deleteProductValidation,
} = require("../middlewares/validators/product-validator");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, path.join(__dirname, "..", "images")); // Ensure this is the correct path
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/add-product",
  upload.single("image"),
  authenticateUser,
  validate(addProductValidation, {}, {}),
  truncateDescription,
  ProductController.addProduct
);

router.get(
  "/all-products",
  authenticateUser,
  // validate(getProductValidation, {}, {}),
  truncateDescription,
  ProductController.getProducts
);

router.get(
  "/:id",
  authenticateUser,
  // validate(getSingleProductValidation, {}, {}),
  truncateDescription,
  ProductController.getSingleProduct
);

router.put(
  "/:id",
  upload.single("image"),
  authenticateUser,
  // validate(updateProductValidation, {}, {}),
  truncateDescription,
  ProductController.updateProduct
);

router.delete(
  "/:id",
  authenticateUser,
  // validate(deleteProductValidation, {}, {}),
  ProductController.deleteProduct
);

module.exports = router;
