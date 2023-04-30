const Joi = require('joi'); 
const FileValidator = require(base("illuminate/utils/FileValidator"));

class t {

  static schema = {
    multipart: FileValidator.object({
      file1: new FileValidator().required().min(1000),
      file2: new FileValidator().max(200).required()
    })
  }

}

module.exports = t;
