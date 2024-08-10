const { validate, ValidationError, Joi } = require("express-validation");

// ---Express Validation for Sign up API---
const registerValidation = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required(),
    userType: Joi.string().valid("user", "seller").required(),
    businessName: Joi.string().when("userType", {
      is: "seller",
      then: Joi.string().required(),
      otherwise: Joi.string().allow("").optional(),
    }),
    gstNumber: Joi.string().when("userType", {
      is: "seller",
      then: Joi.string().required(),
      otherwise: Joi.string().allow("").optional(),
    }),
    categoryId: Joi.string().when("userType", {
      is: "seller",
      then: Joi.string().required(),
      otherwise: Joi.string().allow("").optional(),
    }),
  }),
};

// ---Express Validation for Sign in API---
const logInValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    userType: Joi.string().valid("user", "seller").required(),
  }),
};

// ---Express Validation for Forgot Password---
const forgotPasswordValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

// ---Express Validation for Reset Password---
const resetPasswordValidation = {
  body: Joi.object({
    userId: Joi.string().required(),
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }),
};

module.exports = {
  registerValidation,
  logInValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
