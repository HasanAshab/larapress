const joi = require('joi'); 

class VerifyEmail {

  static schema = {
    urlencoded: {
      target: 'body',
      rules:joi.object({
        id: joi.string().required(),
        token: joi.string().required(),
      })
    }
  }

}

module.exports = VerifyEmail;
