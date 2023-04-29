const Joi = require('joi'); 
const FileValidator = require(base("illuminate/utils/FileValidator"));

class t {

  static schema = {
    multipart: FileValidator.rules({
      file: FileValidator.required()
    })
  }

}

module.exports = t;
