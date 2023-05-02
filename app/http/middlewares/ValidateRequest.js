const Middleware = require(base("illuminate/middlewares/Middleware"));
const path = require('path');

class ValidateRequest extends Middleware {
  handle(req, res, next) {
    try {
      var ValidationRule = require(base(path.join('app/http/validations/', this.options[0])));
    } catch {
      return next();
    }
    const { urlencoded, multipart } = ValidationRule.schema;
    if (typeof urlencoded !== "undefined") {
      const { error } = urlencoded.rules.validate(req[urlencoded.target]);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }
    }

    if (typeof multipart !== "undefined") {
      const contentType = req.headers["content-type"];
      if (!contentType || !contentType.startsWith("multipart/form-data")) {
        return res.status(400).json({
          message: "Only multipart/form-data requests are allowed",
        });
      }
      this._parseFiles(req);
      const error = multipart.validate(req.files);
      if (error) {
        return res.status(400).json({
          message: error,
        });
      }
    }
    next();
  }

  _parseFiles(req) {
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
  }
}

module.exports = ValidateRequest;
