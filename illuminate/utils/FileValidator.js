class FileValidator {
  constructor() {
    this.rules = {};
  }

  static requiredValidator() {
    if(!this.files[this.fieldName]){
      throw new Error(`The ${this.fieldName} field is required!`);
    }
  }

  static maxValidator() {
    
  }

  static minValidator() {
    
  }

  static mimetypesValidator() {
    
  }

  static customValidator(cb) {
    cb(this.files[this.fieldName]);
  }

  static object(obj) {
    this.object = obj;
    return this;
  }

  static getValidators() {
    const staticMethods = Object.getOwnPropertyNames(this);
    const validators = staticMethods.filter((name) => name.endsWith("Validator"));
    return validators;
  }

  static addRules() {
    const rules = this.getValidators().map((name) => name.replace("Validator", ""));
    for (let i in rules) {
      FileValidator.prototype[rules[i]] = function (value = true) {
        this.rules[rules[i]] = value;
        return this;
      };
    }
  }
  
  static validate(files) {
    this.files = files;
    for (const [fieldName, {rules}] of Object.entries(this.object)) {
      this.fieldName = fieldName;
      for(const [rule, value] of Object.entries(rules)){
        this[`${rule}Validator`](value);
      }
    }
  }
}

FileValidator.addRules();

module.exports = FileValidator;

//curl -X POST -F 'file=@storage/test_files/image.png' http://127.0.0.1:8000/api/auth
