const Joi = require('joi'); 
const FileValidator = require(base("illuminate/utils/FileValidator"));

class t {

  static schema = {
    multipart: FileValidator.object({
      file: new FileValidator().min(100).maxLength(2).mimetypes(['image/png', 'image/jpeg']),
      //file2: new FileValidator().max(200)
    })
  }

}

module.exports = t;
