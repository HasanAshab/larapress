const joi = require('joi'); 

class Login {
  static target = 'body';
  
  static schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

}

module.exports = Login;
