const joi = require('joi'); 

class VerifyEmail {

  static schema = {
    urlencoded: {
      target: 'query',
      rules:joi.object({
        id: joi.string().required(),
        token: joi.string().required(),
      })
    }
  }

}

module.exports = VerifyEmail;
