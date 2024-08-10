const { Joi } = require("express-validation");

// ----Express Validation for Adding Product API----
const addProductValidation = {
  body: Joi.object({
    category: Joi.string().required(),
    seller: Joi.string().required(),
    productName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    discount: Joi.number().valid(5, 10, 20).required(),
    offer: Joi.object({
      startDate: Joi.date().required(),
      closeDate: Joi.date().required(),
    }).required(),
  }),
};

// ----Express Validation for Update Product API----
const updateProductValidation = {
  body: Joi.object({
    category: Joi.string().optional(),
    seller: Joi.string().optional(),
    productName: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().optional(),
    discount: Joi.number().valid(5, 10, 20).optional(),
    offer: Joi.object({
      startDate: Joi.date().optional(),
      closeDate: Joi.date().optional(),
    }).optional(),
  }),
};

// ==================== Below validation is Not Necessary (But good practice to have) ======================

// ----Express Validation for Get Product API----
// const getProductValidation = {
//   body: Joi.object({
//     id: Joi.string().required().length(24).hex(), //Example for MongoDB ObjectId
//   }),
// };

// ----Express Validation for Get Single Product API----
// const getSingleProductValidation = {
//   body: Joi.object({
//     id: Joi.string().required().length(24).hex(),
//   }),
// };

// ----Express Validation for Delete Product API----
// const deleteProductValidation = {
//   body: Joi.object({
//     id: Joi.string().required().length(24).hex(), //Example for MongoDB objectId
//   }),
// };

module.exports = {
  addProductValidation,
  updateProductValidation,
  // getProductValidation,
  // getSingleProductValidation,
  // deleteProductValidation,
};
