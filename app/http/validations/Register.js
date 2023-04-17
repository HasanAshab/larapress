const joi = require('joi'); 

class Register {
  static target = 'body';
  
  static schema = joi.object({
    email: joi.string().email().required(),
    name: joi.string().required(),
    password: joi.string().min(8).required(),
    password_confirmation: joi.string().required().valid(joi.ref('password')),
  });

}

module.exports = Register;
