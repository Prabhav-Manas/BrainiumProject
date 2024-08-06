const Product = require("../models/product");

exports.addProduct = async (req, res) => {
  // const sellerId = req.user._id;
  try {
    const {
      category,
      productName,
      description,
      price,
      startDate,
      closeDate,
      discount,
    } = req.body;

    console.log("Request body:", req.body); // Log req.body to check incoming data

    // Validate and parse dates
    const parsedStartDate = new Date(startDate);
    const parsedCloseDate = new Date(closeDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedCloseDate.getTime())) {
      console.error(
        `Invalid Date - startDate: ${startDate}, closeDate: ${closeDate}`
      );
      return res.status(400).json({
        message: "Invalid date format. Ensure dates are in ISO 8601 format.",
        details: { startDate, closeDate },
      });
    }

    // Validate and parse discount
    const parsedDiscount = parseInt(discount, 10);
    if (isNaN(parsedDiscount) || ![5, 10, 20].includes(parsedDiscount)) {
      return res.status(400).json({
        message: "Invalid discount value.",
        details: { discount },
      });
    }

    // const images = req.files ? req.files.map((file) => file.filename) : [];

    const newProduct = new Product({
      category,
      seller: req.user._id,
      productName,
      description,
      // images,
      price,
      offer: {
        startDate: parsedStartDate,
        closeDate: parsedCloseDate,
      },
      discount: parsedDiscount,
    });

    console.log("New Product:=>", newProduct);

    await newProduct.save();

    // console.log("Uploaded files:", req.files);

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
      // files: req.files,
    });
  } catch (error) {
    // if (error.message === "Invalid MIME Type") {
    //   return res.status(400).json({
    //     message: "Invalid MIME Type",
    //   });
    // }
    res.status(500).json({
      message: "Error adding product",
      error: error.message,
    });
  }
};

exports.getProducts = async (req, res) => {
  const pageSize = +req.query.pageSize; // Convert to number
  const currentPage = +req.query.page; // Convert to number
  const productQuery = Product.find();

  if (pageSize && currentPage) {
    productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  try {
    const fetchedProducts = await productQuery;
    const count = await Product.countDocuments();

    res.status(200).json({
      message: "Products fetched successfully!",
      products: fetchedProducts,
      maxProducts: count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Fetching products failed!",
      error: error.message,
    });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (product) {
      res.status(200).json({
        message: "Product Fetched!",
        product: product,
      });
    } else {
      res.status(404).json({
        message: "No Product Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Fetching product failed",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    console.log("Updating product with ID:", productId);
    const updatedProduct = {
      category: req.body.category,
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      offer: {
        startDate: new Date(req.body.startDate),
        closeDate: new Date(req.body.closeDate),
      },
      discount: req.body.discount,
    };

    console.log("Updated product data:", updatedProduct);

    const product = await Product.findByIdAndUpdate(
      // { _id: productId },
      productId,
      { $set: updatedProduct },
      { new: true } // This returns the updated document
    );

    if (product) {
      res.status(200).json({
        message: "Product updated",
        product: product,
      });
    } else {
      res.status(404).json({
        message: "No Product Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Product update Failed!",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.deleteOne({ _id: productId });

    if (product.deletedCount > 0) {
      res.status(200).json({
        message: "Product deleted!",
      });
    } else {
      res.status(404).json({
        message: "Product Not Found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Deleting Product Failed!",
      error: error.message,
    });
  }
};
