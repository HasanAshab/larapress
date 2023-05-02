const { passErrorsToHandler } = require(base('illuminate/foundation'));

class Middleware {
  constructor(options = []) {
    this.options = options;
    this.handle = passErrorsToHandler(this.handle.bind(this));
  }
}

module.exports = Middleware;