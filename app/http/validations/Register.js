const joi = require('joi');

class Register {

  static schema = {
    urlencoded: {
      target: 'body',
      rules: joi.object({
        email: joi.string().email().required(),
        name: joi.string().required(),
        password: joi.string().min(8).required(),
        password_confirmation: joi.string().required().valid(joi.ref('password')),
      })
    },
    multipart: {
      profile: {
        mimetypes: ['image/jpeg', 'image/png'],
        maxFiles: 1,
        max: 1000*1000,
      },
    }
  }
}
    
module.exports = Register;