const Joi = require('joi');

class Register {

  static schema = {
    urlencoded: {
      target: 'body',
      rules: Joi.object({
        name: Joi.string().min(3).max(12).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        password_confirmation: Joi.string().required().valid(Joi.ref('password')),
      })
    },
    multipart: {
      logo: {
        required: false,
        mimetypes: ['image/jpeg', 'image/png'],
        maxFiles: 1,
        max: 1000*1000,
      },
    }
  }
}
    
module.exports = Register;