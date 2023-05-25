import { middleware, capitalizeFirstLetter } from "helpers";

export default abstract class Controller {
  /*
  [key: string]: Function | Function[];
  
  constructor() {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    for (const method of methods) {
      if(method !== "constructor"){
        this[method] = this._insertValidator(method);
      }
    }
  }
  
  _insertValidator(methodName: string): Function[] {
    const controllerPrefix = this.constructor.name.replace("Controller", "");
    const validationSubPath = `${controllerPrefix}/${capitalizeFirstLetter(methodName)}`;
    return [
      //middleware(`validate:${validationSubPath}`),
      this[methodName]
    ]
  }
  */
}