import { File } from "types";
import validators from "illuminate/utils/FileValidator/validators";
import FileValidatorError from "illuminate/exceptions/utils/FileValidatorError";

class FileValidator {
  [key: string]: any;
  static object: {[key: string]: FileValidator};
  static file: File;
  static fieldName: string;
  public rules: {[key: string]: any} = { required: false };
  
  static fields(obj: {[key: string]: FileValidator}): typeof FileValidator {
    this.object = obj;
    return this;
  }

  static addRules() {
    const rules = ["required", "maxLength", ...Object.keys(validators)];
    for (let i in rules) {
      FileValidator.prototype[rules[i]] = function (value: unknown = true): FileValidator {
        this.rules[rules[i]] = value;
        return this;
      };
    }
  }

  static fireValidator(rules: {[key: string]: any}) {
    for (const [rule, value] of Object.entries(rules)) {
      validators[rule](value);
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