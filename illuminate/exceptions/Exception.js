class Exception extends Error {
  constructor(message = "Internal Server Error!") {
    super(message);
    this.name = this.constructor.name;
  }

  throw(name){
    if (!this.errors.hasOwnProperty(name)) {
      throw new Error(`Error type '${name}' does not exist`);
    }

    const error = new Error();
    error.name = this.constructor.name;
    error.type = name;
    for (const [key, value] of Object.entries(this.errors[name])) {
      error[key] = value;
    }
    throw error;
  };
}

module.exports = Exception;
