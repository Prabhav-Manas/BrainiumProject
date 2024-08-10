module.exports = (req, res, next) => {
  const maxLength = 300;
  // Truncate description in the request body
  if (req.body.description && req.body.description.length > maxLength) {
    req.body.description = req.body.description.substring(0, maxLength) + "...";
  }
  next();
};
