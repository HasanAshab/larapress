const joi = require('joi'); 

class ResetPassword {

  static schema = {
    urlencoded: {
      target: 'body',
      rules: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
        token: joi.string().required(),
      })
    }
  }
}

module.exports = ResetPassword;
