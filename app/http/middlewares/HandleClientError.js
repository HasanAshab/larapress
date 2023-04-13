const Joi = require('joi');

module.exports = () => {
  return (err, req, res, next) => {
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