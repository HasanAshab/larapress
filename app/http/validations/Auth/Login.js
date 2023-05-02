const Joi = require('joi'); 

class Login {

  static schema = {
    urlencoded: {
      target: 'body',
      rules: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      })
    }
  }

}

module.exports = Login;
