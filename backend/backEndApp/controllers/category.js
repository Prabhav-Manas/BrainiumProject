const Category = require("../models/category");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Fetching categories failed!",
      error: error.message,
    });
  }
};

exports.createCategory = async (req, res, next) => {
  const category = new Category({
    name: req.body.name,
  });

  console.log("Category Name:=>", category.name);

  try {
    const savedCategory = await category.save();
    res.status(201).json({
      message: "Category added successfully!",
      category: savedCategory,
      categoryId: savedCategory._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Adding category failed!",
      error: error.message,
    });
  }
};

exports.updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found!",
      });
    }
    res.status(200).json({
      message: "Category updated successfully!",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Updating category failed!",
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  console.log("Deleting category with ID:", id);

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({
        message: "Category not found!",
      });
    }
    res.status(200).json({
      message: "Category deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Deleting category failed!",
      error: error.message,
    });
  }
};
