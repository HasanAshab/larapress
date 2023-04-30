const Joi = require('joi');
const FileValidator = require(base("illuminate/utils/FileValidator"));

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
      logo: new FileValidator().required().max(1000*1000).maxLength(1).mimetypes(['image/jpeg', 'image/png']),
    }
  }
}
    
module.exports = Register;