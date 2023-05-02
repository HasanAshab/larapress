const Joi = require('joi'); 

class ChangePassword {

  static schema = {
    urlencoded: {
      target: 'body',
      rules: Joi.object({
        old_password: Joi.string().required(),
        password: Joi.string().min(8).required(),
      })
    }
  }
}

module.exports = ChangePassword;
