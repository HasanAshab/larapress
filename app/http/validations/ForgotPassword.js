const joi = require('joi'); 

class ForgotPassword {
  static target = 'body';
  
  static schema = joi.object({
    email: joi.string().email().required(),
  });

}

module.exports = ForgotPassword;
