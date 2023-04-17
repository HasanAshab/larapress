const joi = require('joi'); 

class ChangePassword {
  static target = 'body';
  
  static schema = joi.object({
    old_password: joi.string().required(),
    password: joi.string().min(8).required(),
  });

}

module.exports = ChangePassword;
