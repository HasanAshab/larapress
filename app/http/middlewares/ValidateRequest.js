const FileValidator = require(base("illuminate/utils/FileValidator"));

parseFiles = (req) => {
  const files = {};
  req.files.forEach((file) => {
    if (files[file.fieldname]) {
      if (Array.isArray(files[file.fieldname])) {
        files[file.fieldname].push(file);
      } else {
        files[file.fieldname] = [files[file.fieldname], file];
      }
    } else {
      files[file.fieldname] = file;
    }
  });
  req.files = files;
};

module.exports = (requestName) => {
  const ValidationRule = require(base(`app/http/validations/${requestName}`));
  const { urlencoded, multipart } = ValidationRule.schema;
  return (req, res, next) => {
    if (typeof urlencoded !== "undefined") {
      const { error } = urlencoded.rules.validate(req[urlencoded.target]);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
    }

    if (typeof multipart !== "undefined") {
      const contentType = req.headers["content-type"];
      if (!contentType || !contentType.startsWith("multipart/form-data")) {
        return res.status(400).json({
          success: false,
          message: "Only multipart/form-data requests are allowed",
        });
      }
      parseFiles(req);
      const error = multipart.validate(req.files);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error,
        });
      }
    }
    next();
  };
};
