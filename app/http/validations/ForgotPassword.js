const joi = require('joi'); 

class ForgotPassword {

  static schema = {
    urlencoded: {
      target: 'body',
      rules: joi.object({
        email: joi.string().email().required(),
      })
    }
  }

}

module.exports = ForgotPassword;
