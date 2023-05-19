
export default abstract class Exception {
  static errorType: string;
  static errors: {[key: string]: {[key: string]: any}};

  static type(errorType: string): typeof Exception {
    if (!this.errors.hasOwnProperty(errorType)) {
      throw new Error(`Error type '${errorType}' does not exist`);
    }
    this.errorType = errorType
    return this;
  }

  static create(data?: {[key: string]: string}): typeof Error {
    const error:any = new Error();
    error.name = this.name;
    error.type = this.errorType;
    for (const [key, value] of Object.entries(this.errors[this.errorType])) {
      error[key] = value;
    }
  
    if (data) {
      error.message = error.message.replace(/:(\w+)/g, (match: string, key: string) => {
        return data[key] || match;
      });
    }
    return error;
  }
}
