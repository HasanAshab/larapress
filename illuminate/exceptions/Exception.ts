type CustomError = {[key: string]: any};

export default abstract class Exception {
  static error: CustomError;
  static errors: {[key: string]: CustomError};

  static type(errorType: string): typeof Exception {
    if (!this.errors.hasOwnProperty(errorType)) {
      throw new Error(`Error type '${errorType}' does not exist`);
    }
    this.error = this.errors[errorType];
    this.error.type = errorType;
    this.error.name = this.name;
    return this;
  }

  static create(data?: {[key: string]: string}): CustomError {
    if (data) {
      this.error.message = this.error.message.replace(/:(\w+)/g, (match: string, key: string) => {
        return data[key] || match;
      });
    }
    return this.error;
  }
}
