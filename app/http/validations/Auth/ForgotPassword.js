const Joi = require('joi'); 

class ForgotPassword {

  static schema = {
    urlencoded: {
      target: 'body',
      rules: Joi.object({
        email: Joi.string().email().required(),
      })
    }
  }

}

module.exports = ForgotPassword;
