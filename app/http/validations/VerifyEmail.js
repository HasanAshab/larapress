const joi = require('joi'); 

class VerifyEmail {
  static target = 'body';
  
  static schema = joi.object({
    id: joi.string().required(),
    token: joi.string().required(),
  });

}

module.exports = VerifyEmail;
