const joi = require('joi'); 

class ChangePassword {

  static schema = {
    urlencoded: {
      target: 'body',
      rules: joi.object({
        old_password: joi.string().required(),
        password: joi.string().min(8).required(),
      })
    }
  }
}

module.exports = ChangePassword;
