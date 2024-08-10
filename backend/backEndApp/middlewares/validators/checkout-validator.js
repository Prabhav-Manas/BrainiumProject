const { Joi } = require("express-validation");

const createPaymentIntentValidation = {
  body: Joi.object({
    amount: Joi.number().positive().required(),
    userId: Joi.string().length(24).hex().required(), //Assuming MongoDB ObjectId
    name: Joi.string().required(),
    delivery: Joi.object({
      address: Joi.string().required(),
      deliveryStatus: Joi.string()
        .valid("processing", "shipped", "delivered")
        .default("processing"),
    }).required(),
    cartItems: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().length(24).hex().required(), //Assuming MongoDB ObjectId
          quantity: Joi.number().integer().positive().required(),
        })
      )
      .required(),
  }),
};

const saveOrderDetailsValidation = {
  body: Joi.object({
    userId: Joi.string().length(24).hex().required(), //Assuming MongoDB ObjectId
    name: Joi.string().required(),
    amount: Joi.number().positive().required(),
    payment: Joi.object({
      id: Joi.string().required(),
      status: Joi.string().valid("pending", "succeeded", "failed").required(),
    }).required(),
    cartItems: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().length(24).hex().required(), //Assuming MongoDB ObjectId
          quantity: Joi.number().integer().positive().required(),
        })
      )
      .required(),
    delivery: Joi.object({
      address: Joi.string().optional(),
      deliveryStatus: Joi.string()
        .valid("processing", "shipped", "delivered")
        .default("processing"),
    }).required(),
  }),
};

const updatePaymentStatusValidation = {
  body: Joi.object({
    payment: Joi.object({
      id: Joi.string().required(),
    }).required(),
    status: Joi.string().valid("pending", "succeeded", "failed").required(),
  }),
};

const getOrderHistoryValidation = {
  params: Joi.object({
    userId: Joi.string().length(24).hex().required(), //Assuming MongoDB ObjectId
  }),
};

const getSellerOrdersValidation = {
  params: Joi.object({
    userId: Joi.string().length(24).hex().required(), //Assuming MongoDB ObjectId
  }),
};

module.exports = {
  createPaymentIntentValidation,
  saveOrderDetailsValidation,
  updatePaymentStatusValidation,
  getOrderHistoryValidation,
  getSellerOrdersValidation,
};
