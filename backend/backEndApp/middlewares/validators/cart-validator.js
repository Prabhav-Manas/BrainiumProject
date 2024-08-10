const { Joi } = require("express-validation");

const objectIdSchema = Joi.string().length(24).hex().required();

const addToCartValidation = {
  body: Joi.object({
    productId: objectIdSchema,
    quantity: Joi.number().integer().min(1).required(),
  }),
};

const updateCartItemValidation = {
  body: Joi.object({
    cartItemId: objectIdSchema,
    quantity: Joi.number().integer().min(1).required(),
  }),
};

const removeCartItemValidation = {
  params: Joi.object({
    cartItemId: objectIdSchema,
  }),
};

module.exports = {
  addToCartValidation,
  updateCartItemValidation,
  removeCartItemValidation,
};
