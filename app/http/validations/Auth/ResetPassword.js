const Joi = require('joi'); 

class ResetPassword {

  static schema = {
    urlencoded: {
      target: 'body',
      rules: Joi.object({
        id: Joi.string().required(),
        password: Joi.string().min(8).required(),
        token: Joi.string().required(),
      })
    }
  }
}

module.exports = ResetPassword;
