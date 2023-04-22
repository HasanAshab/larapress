class FileValidator {
  static required = (file, fieldName, option) => {
    if (option && (!file || Object.keys(file).length === 0)) {
      throw new Error(`The ${fieldName} field is required!`);
    }
  };

  static max = (file, fieldName, maxSize) => {
    if (file.size > maxSize) {
      throw new Error(
        `The ${fieldName} file max size is ${maxSize / 1000000} MB!`
      );
    }
  };

  static min = (file, fieldName, minSize) => {
    if (file.size < minSize) {
      throw new Error(
        `The ${fieldName} file min size is ${minSize / 1000000} MB!`
      );
    }
  };

  static mimetypes = (file, fieldName, validMimetypes) => {
    if (!validMimetypes.includes(file.mimetype)) {
      throw new Error(
        `The ${fieldName} file mimetype should be ${validMimetypes.join(
          " or "
        )}!`
      );
    }
  };

  static maxFiles = (files, fieldName, maxFileCount) => {
    if (
      (files instanceof Array && files.length > maxFileCount) ||
      maxFileCount < 1
    ) {
      throw new Error(
        `The ${fieldName} field max file count should be ${maxFileCount}`
      );
    }
  };

  static custom = (file, fieldName, cb) => {
    cb(file);
  };

  static validate = (files, rules) => {
    for (const [fieldName, validators] of Object.entries(rules)) {
      if (files[fieldName]) {
        for (const [validator, options] of Object.entries(validators)) {
          try {
            if (validator === "maxFiles") {
              FileValidator[validator](files[fieldName], fieldName, options);
            } else {
              if (files[fieldName] instanceof Array) {
                for (const file of files[fieldName]) {
                  FileValidator[validator](file, fieldName, options);
                }
              } else {
                FileValidator[validator](files[fieldName], fieldName, options);
              }
            }
          } catch (error) {
            return error.message;
          }
        }
      }
    }
  };
}

module.exports = FileValidator;
