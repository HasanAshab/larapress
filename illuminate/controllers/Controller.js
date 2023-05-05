const { passErrorsToHandler } = require(base('illuminate/utils'));

class Controller {
  constructor() {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    for (const method of methods) {
      if(!['constructor'].includes(method)){
        this[method] = passErrorsToHandler(this[method]);
        this[method] = this._insertValidator(method);
      }
    }
  }
  
  _insertValidator(methodName){
    const controllerPrefix = this.constructor.name.replace('Controller', '');
    const validationSubPath = `${controllerPrefix}/${capitalizeFirstLetter(methodName)}`;
    return [
      middleware(`validate:${validationSubPath}`),
      this[methodName]
    ]
    
  }
}

module.exports = Controller;