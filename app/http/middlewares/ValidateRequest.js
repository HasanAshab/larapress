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

module.exports = () => {
  return (req, res, next) => {
    const handlerName = req.route.stack[req.route.stack.length - 1].name;
    const ValidationRuleName = capitalizeFirstLetter(handlerName);
    try{
      var ValidationRule = require(base(`app/http/validations/${ValidationRuleName}`));
    }
    catch{
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
      parseFiles(req);
      const error = multipart.validate(req.files);
      if (error) {
        return res.status(400).json({
          message: error,
        });
      }
    }
    next();
  };
};
