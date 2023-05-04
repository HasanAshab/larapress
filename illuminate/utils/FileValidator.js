const FileValidatorError = require(base(
  "illuminate/exceptions/utils/FileValidatorError"
));

class FileValidator {
  constructor() {
    this.rules = { required: false };
  }

  static fields(obj) {
    this.object = obj;
    return this;
  }

  static maxValidator(bytes) {
    if (this.file.size > bytes) {
      throw FileValidatorError.type("TOO_LARGE_FILE").create({
        fieldName: this.fieldName,
        size: `${bytes / 1000000} MB!`,
      });
    }
  }
  static minValidator(bytes) {
    if (this.file.size < bytes) {
      throw FileValidatorError.type("TOO_SMALL_FILE").create({
        fieldName: this.fieldName,
        size: `${bytes / 1000000} MB!`,
      });
    }
  }

  static mimetypesValidator(validMimetypes) {
    if (!validMimetypes.includes(this.file.mimetype)) {
      throw FileValidatorError.type("INVALID_MIMETYPE").create({
        fieldName: this.fieldName,
        mimetypes: validMimetypes.join(" or "),
      });
    }
  }

  static customValidator(cb) {
    cb(this.file);
  }

  static getValidators() {
    const staticMethods = Object.getOwnPropertyNames(this);
    const validators = staticMethods.filter((name) =>
      name.endsWith("Validator")
    );
    return validators;
  }

  static addRules() {
    const rules = this.getValidators().map((name) =>
      name.replace("Validator", "")
    );
    rules.push("required");
    rules.push("maxLength");
    for (let i in rules) {
      FileValidator.prototype[rules[i]] = function (value = true) {
        this.rules[rules[i]] = value;
        return this;
      };
    }
  }

  static fireValidatorFor(rules) {
    for (const [rule, value] of Object.entries(rules)) {
      this[`${rule}Validator`](value);
    }
  }

  static removeUnnecessaryRules(files) {
    for (const [fieldName, { rules }] of Object.entries(this.object)) {
      if (!files[fieldName]) {
        if (rules.required) {
          throw FileValidatorError.type("REQUIRED_FIELD_MISSING").create({
            fieldName,
          });
        }
        delete this.object[fieldName];
      } else {
        if (Array.isArray(files[fieldName]) && files[fieldName].length > rules.maxLength) {
          throw FileValidatorError.type("TOO_MANY_PARTS").create({
            fieldName,
            maxLength: rules.maxLength,
          });
        }
        delete this.object[fieldName].rules.required;
        delete this.object[fieldName].rules.maxLength;
      }
    }
  }

  static validate(files) {
    this.removeUnnecessaryRules(files);
    for (const [fieldName, { rules }] of Object.entries(this.object)) {
      this.fieldName = fieldName;
      if (Array.isArray(files[fieldName])) {
        for (const file of files[fieldName]) {
          this.file = file;
          this.fireValidatorFor(rules);
        }
      } else {
        this.file = files[fieldName];
        this.fireValidatorFor(rules);
      }
    }
  }
}

FileValidator.addRules();
module.exports = FileValidator;