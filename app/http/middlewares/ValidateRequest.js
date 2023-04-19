const FileValidator = util('FileValidator');

parseFiles = (req) => {
  const files = {};
  for(const file of req.files){
    if(files[file.fieldname]){
      files[file.fieldname].push(file)
    }
    else{
      files[file.fieldname] = [file];
    }
  }
  req.files = files;
}

module.exports = (requestName) => {
  const ValidationRule = require(`../validations/${requestName}`);
  const { urlencoded, multipart } = ValidationRule.schema;
  return (req, res, next) => {
    const { error } = urlencoded.rules.validate(req[urlencoded.target]);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    
    if (typeof multipart !== 'undefined'){
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.startsWith('multipart/form-data')) {
        return res.status(400).json({
          success: false,
          message: 'Only multipart/form-data requests are allowed'
        });
      }
    parseFiles(req);
      const error = FileValidator.validate(req.files, multipart);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error
        });
      }
    }

    next();
  }
}