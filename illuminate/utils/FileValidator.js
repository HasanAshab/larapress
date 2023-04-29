class FileValidator {
  
  static rules(obj){
    this.rules = obj;
    return this;
  }
  
  static required(){
    //this.required = true;
    return this;
  };
  
  static max(){
    //this.max = true;
    return this;
  };
  
  static custom(file, fieldName, cb){
    cb(file);
    return this;
  };

  static validate(files){
    console.log(this.rules.file.required)
  };
}

module.exports = FileValidator;
