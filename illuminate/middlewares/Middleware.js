const { passErrorsToHandler } = require(base('illuminate/utils'));

class Middleware {
  constructor(options = []) {
    this.options = options;
    this.handle = passErrorsToHandler(this.handle.bind(this));
  }
}

module.exports = Middleware;