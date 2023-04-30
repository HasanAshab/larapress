class FileValidator {
  constructor() {
    this.rules = { required: false };
  }

  static object(obj) {
    this.object = obj;
    return this;
  }

  static maxLengthValidator(maxFileCount, files) {
    files = files[this.fieldName];
    if (Array.isArray(files) && files.length > maxFileCount) {
      throw new Error(
        `The ${this.fieldName} field max file count should be ${maxFileCount}`
      );
    }
  }

  static maxValidator(bytes) {
    if (this.file.size > bytes) {
      throw new Error(
        `The ${this.fieldName} field max size is ${bytes / 1000000} MB!`
      );
    }
  }
  static minValidator(bytes) {
    if (this.file.size < bytes) {
      throw new Error(
        `The ${this.fieldName} field min size is ${bytes / 1000000} MB!`
      );
    }
  }

  static mimetypesValidator(validMimetypes) {
    if (!validMimetypes.includes(this.file.mimetype)) {
      throw new Error(
        `The ${this.fieldName} field mimetype should be ${validMimetypes.join(
          " or "
        )}!`
      );
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
          throw new Error(`The ${this.fieldName} field is required!`);
        }
        delete this.object[fieldName];
      } else {
        //here
        if (Array.isArray(files[fieldName]) && files[fieldName].length > rules.maxLength) {
          throw new Error(
            `The ${fieldName} field max file count should be ${rules.maxLength}`
          );
        }
        delete this.object[fieldName].rules.required;
        delete this.object[fieldName].rules.maxLength;
      }
    }
  }

  //!file and !required
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

//curl -X POST -F 'file=@storage/test_files/image.png' http://127.0.0.1:8000/api/auth
