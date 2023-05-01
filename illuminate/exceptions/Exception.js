class Exception {
  static type (errorType){
    if (!this.errors.hasOwnProperty(errorType)) {
      throw new Error(`Error type '${errorType}' does not exist`);
    }
    this.type = errorType;
    return this;
  }
  
  static create(data) {
    const error = new Error();
    error.name = this.constructor.name;
    error.type = this.type;
    for (const [key, value] of Object.entries(this.errors[this.type])) {
      error[key] = value;
    }
    if(data){
    error.message = error.message.replace(/:(\w+)/g, (match, key) => {
      return data[key] || match;
    });
    }
    return error;
  }
}

module.exports = Exception;
