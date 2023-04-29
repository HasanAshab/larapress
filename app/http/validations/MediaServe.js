const Joi = require('joi'); 

class MediaServe {

  static schema = {
    urlencoded: {
      target: 'params',
      rules: Joi.object({
        id: Joi.string().required(),
      })
    },
  }

}

module.exports = MediaServe;
