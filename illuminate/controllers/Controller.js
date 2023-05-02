const { passErrorsToHandler } = require(base('illuminate/foundation'));

class Controller {
  constructor() {
    this.login = this._insertValidator(this.login);
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    return 0;
    for (const method of methods) {
      if(!['constructor'].includes(method)){
        this[method] = passErrorsToHandler(this[method].bind(this));
      }
    }
  }
  
  _insertValidator(fn){
    const controllerPrefix = this.constructor.name.replace('Controller', '');
    const validationSubPath = `${controllerPrefix}/${capitalizeFirstLetter(fn.name)}`;

    return [
      middleware(`validate:${validationSubPath}`),
      fn
    ]
    
  }
}

module.exports = Controller;