const joi = require('joi');

class Register {

  static schema = {
    urlencoded: {
      target: 'body',
      rules: joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
        password_confirmation: joi.string().required().valid(joi.ref('password')),
      })
    },
    multipart: {
      profil: {
        required: false,
        mimetypes: ['image/jpeg', 'image/png'],
        maxFiles: 1,
        max: 1000*1000,
      },
    }
  }
}
    
module.exports = Register;