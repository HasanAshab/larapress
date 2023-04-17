const joi = require('joi'); 

class ResetPassword {
  static target = 'body';
  
  static schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    token: joi.string().required(),
  });

}

module.exports = ResetPassword;
