const Joi = require('joi');

module.exports = () => {
  return (err, req, res, next) => {
    if (err instanceof Joi.ValidationError){
      return res.status(400).json({
        success:false,
        message: err.details[0].message
      });
    }
    
    return (process.env.NODE_ENV === 'production')
      ?res.status(500).json({
        success: false,
        message: 'Internal server error!' 
      })
      :res.status(500).json({
        success: false,
        message: err.stack
      });
  }
}