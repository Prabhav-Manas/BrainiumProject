const { Joi } = require("express-validation");

const createCategoryValidation = {
  body: Joi.object({
    name: Joi.string().min(3).max(255).required(),
  }),
};

const updateCategoryValidation = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required(), //Assuming MongoDB ObjectId
  }),
  body: Joi.object({
    name: Joi.string().min(3).max(255).required(),
  }),
};

const deleteCategoryValidation = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required(), //Assuming MongoDB ObjectId
  }),
};

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
  deleteCategoryValidation,
};
