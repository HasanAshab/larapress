const { passErrorsToHandler } = require(base('illuminate/foundation'));

class Middleware {
  constructor() {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    for (const method of methods) {
      if(!['constructor'].includes(method)){
        this[method] = passErrorsToHandler(this[method].bind(this));
      }
    }
  }
}

module.exports = Middleware;