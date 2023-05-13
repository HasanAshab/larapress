import FileValidatorError from "illuminate/exceptions/utils/FileValidatorError";
import { File } from "types";

class FileValidator {
  static object: {[key: string]: FileValidator};
  static file: File;
  static fieldName: string;
  public rules: {[key: string]: any};

  constructor() {
    this.rules = { required: false };
  }

  static fields(obj: {[key: string]: FileValidator}): typeof FileValidator {
    this.object = obj;
    return this;
  }

  static maxValidator(bytes: number) {
    if (this.file.size > bytes) {
      throw FileValidatorError.type("TOO_LARGE_FILE").create({
        fieldName: this.fieldName,
        size: `${bytes / 1000000} MB!`,
      });
    }
  }
  static minValidator(bytes: number) {
    if (this.file.size < bytes) {
      throw FileValidatorError.type("TOO_SMALL_FILE").create({
        fieldName: this.fieldName,
        size: `${bytes / 1000000} MB!`,
      });
    }
  }

  static mimetypesValidator(validMimetypes: string[]) {
    if (!validMimetypes.includes(this.file.mimetype)) {
      throw FileValidatorError.type("INVALID_MIMETYPE").create({
        fieldName: this.fieldName,
        mimetypes: validMimetypes.join(" or "),
      });
    }
  }

  static customValidator(cb: ((file: File) => void)) {
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

  static fireValidator(rules: {[key: string]: any}) {
    for (const [rule, value] of Object.entries(rules)) {
      this[`${rule}Validator`](value);
    }
  }

  static removeUnnecessaryRules(files: {[key: string]: File}) {
    for (const [fieldName, { rules }] of Object.entries(this.object)) {
      if (!files[fieldName]) {
        if (rules.required) {
          throw FileValidatorError.type("REQUIRED_FIELD_MISSING").create({
            fieldName,
          });
        }
        delete this.object[fieldName];
      } else {
        const fileStack = files[fieldName]
        if (Array.isArray(fileStack) && fileStack.length > rules.maxLength) {
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

  static validate(files: {[key: string]: File}) {
    this.removeUnnecessaryRules(files);
    for (const [fieldName, { rules }] of Object.entries(this.object)) {
      this.fieldName = fieldName;
      const fileStack = files[fieldName];
      if (Array.isArray(fileStack)) {
        for (const file of fileStack) {
          this.file = file;
          this.fireValidator(rules);
        }
      } else {
        this.file = files[fieldName];
        this.fireValidator(rules);
      }
    }
  }
}

FileValidator.addRules();

export default FileValidator;