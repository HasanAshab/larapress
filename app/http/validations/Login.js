const joi = require('joi'); 

class Login {

  static schema = {
    urlencoded: {
      target: 'body',
      rules: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
      })
    }
  }

}

module.exports = Login;
