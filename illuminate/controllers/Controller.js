class Controller {
  constructor() {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    for (const method of methods) {
      if(!['constructor'].includes(method)){
        this[method] = this._withTryCatch(this[method].bind(this));
      }
    }
  }

  _withTryCatch(fn){
    return async function(req, res, next) {
      try {
        await fn(req, res, next);
      }
      catch (err) {
        next(err)
      }
    }
  }
}

module.exports = Controller;