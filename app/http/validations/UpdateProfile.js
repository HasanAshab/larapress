const joi = require('joi'); 

class UpdateProfile {

  static schema = {
    urlencoded: {
      target: 'body',
      rules:joi.object({
        name: joi.string().required(),
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

module.exports = UpdateProfile;
