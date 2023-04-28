class Exception {
  throw = (name) => {
    const error = new Error;
    error.name = this.constructor.name;
    error.type = name;
    for(const [key, value] of Object.entries(this.errors[name])){
      error[key] = value;
    }
    throw error;
  }
}

module.exports = Exception;
