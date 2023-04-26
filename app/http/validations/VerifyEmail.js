const Joi = require('joi'); 

class VerifyEmail {

  static schema = {
    urlencoded: {
      target: 'query',
      rules:Joi.object({
        id: Joi.string().required(),
        token: Joi.string().required(),
      })
    }
  }

}

module.exports = VerifyEmail;
