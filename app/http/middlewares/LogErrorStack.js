const Joi = require('joi');

module.exports = () => {
  return (err, req, res, next) => {
    if (err instanceof Joi.ValidationError){
      return res.status(400).json({
        success: false,
        message: err.details[0].message
      });
    }
    log(err.stack);
    next(err);
  }
}