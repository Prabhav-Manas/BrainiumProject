const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/category");
const { validate } = require("express-validation");
const {
  createCategoryValidation,
  updateCategoryValidation,
  deleteCategoryValidation,
} = require("../middlewares/validators/category-validator");

router.get("/all-categories", CategoryController.getAllCategories);

router.post(
  "/add-category",
  validate(createCategoryValidation, {}, {}),
  CategoryController.createCategory
);

router.put(
  "/:id",
  validate(updateCategoryValidation, {}, {}),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  validate(deleteCategoryValidation, {}, {}),
  CategoryController.deleteCategory
);

module.exports = router;
