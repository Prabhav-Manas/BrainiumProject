const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/category");

router.get("/all-categories", CategoryController.getAllCategories);

router.post("/add-category", CategoryController.createCategory);

router.put("/:id", CategoryController.updateCategory);

router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;
