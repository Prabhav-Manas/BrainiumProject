// module.exports = (req, res, next) => {
//   const maxLength = 300;
//   if (req.body.description && req.body.description > maxLength) {
//     req.body.description = req.body.description.substring(0, maxLength) + "...";
//   }
//   next();
// };

module.exports = (req, res, next) => {
  const maxLength = 300;

  if (req.body.description && req.body.description.length > maxLength) {
    req.body.description = req.body.description.substring(0, maxLength) + "...";
  }

  if (res.locals.product && res.locals.product.description.length > maxLength) {
    res.locals.product.description =
      res.locals.product.description.substring(0, maxLength) + "...";
  }

  if (res.locals.products) {
    res.locals.products = res.locals.products.map((product) => {
      if (product.description.length > maxLength) {
        product.description =
          product.description.substring(0, maxLength) + "...";
      }
      return product;
    });
  }

  next();
};
