const joi = require('joi');

class Test {
  static schema = {
    urlencoded: {
      target: 'body',
      rules: joi.object({
        name: joi.string().required()
      }),
    },

    multipart: {
      profile: {
        maxFiles: 2,
        max: 40*1000,
        min: 10*1000,
        mimetypes: ['image/jpeg', 'image/png'],
        custom: (file) => {
          if (file.originalName === 'jdjd') {
            throw new Error('This is a custom error!')
          }
        }
      },
    }
  }

}

module.exports = Test;