import { NextFunction, RequestHandler, Request, Response } from "express";
import { getVersion } from "helpers";


export default abstract class Controller {
  static stack(version = getVersion()) {
    const controllerInstance = container.resolve(this);
    const controllerPrefix = this.name.replace("Controller", "");
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance)).filter(name => name !== "constructor" && typeof controllerInstance[name] === 'function');
    const handlerAndValidatorStack: Record<string, RequestHandler[]> = {};
    for (const methodName of methodNames) {
      const requestHandler = async function(req: Request, res: Response, next: NextFunction) {
        try {
          return await controllerInstance[methodName].call(controllerInstance, req, res);
        }
        catch (err) {
          next(err)
        }
      }
      handlerAndValidatorStack[methodName] = [requestHandler];
      try {
        const validationSubPath = `${controllerPrefix}/${capitalizeFirstLetter(methodName)}`;
        const validationSchema = require(`~/app/http/${version}/validations/${validationSubPath}`).default;
        const validator = middleware(["validate", { validationSchema }])[0];
        handlerAndValidatorStack[methodName].unshift(validator);
      } catch {}
    }
    return handlerAndValidatorStack;
  }
}