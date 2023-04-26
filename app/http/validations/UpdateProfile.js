const Joi = require('joi'); 

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
      profile: {
        required: false,
        mimetypes: ['image/jpeg', 'image/png'],
        maxFiles: 1,
        max: 1000*1000,
      },
    }
  }

}

module.exports = UpdateProfile;
