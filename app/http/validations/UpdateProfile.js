const Joi = require('joi'); 
const FileValidator = require(base("illuminate/utils/FileValidator"));

class UpdateProfile {

  static schema = {
    urlencoded: {
      target: 'body',
      rules:Joi.object({
        name: Joi.string().min(3).max(12).required(),
        email: Joi.string().email().required(),
      })
    },
    multipart: {
      logo: new FileValidator().required().max(1000*1000).maxLength(1).mimetypes(['image/jpeg', 'image/png']),
    }
  }

}

module.exports = UpdateProfile;
