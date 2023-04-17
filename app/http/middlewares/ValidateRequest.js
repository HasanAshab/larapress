module.exports = (requestName) => {
  const ValidationRule = require(`../validations/${requestName}`);
  return (req, res, next) => {
    const { error } = ValidationRule.schema.validate(req[ValidationRule.target]);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  }
}