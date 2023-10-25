import { Request, AuthenticRequest, Response } from "~/core/express";
import { container } from 'tsyringe';
import Validator from "Validator";
import Router from "Router";

export default function RequestHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const handlersName = Reflect.getMetadata("handlersName", target) ?? [];
  handlersName.push(propertyKey);
  Reflect.defineMetadata("handlersName", handlersName, target);
  const handler = descriptor.value;
  const paramNames = getParams(handler);
  const paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);
  let rules = null;
  descriptor.value = async function(req, res, next){
    try {
      const args = await Promise.all(
        paramTypes.map(async (paramType, i) => {
          if (paramType === Request || paramType.prototype instanceof Request) {
            if(paramType.rules) {
              rules = rules ?? Validator.object(paramType.rules());
              const data = req.method === "GET"
                ? req.query
                : Object.assign({}, req.body, req.files);
              const validated = await rules.validateAsync(data);
              req[req.method === "GET" ? "query" : "body"] = validated;
            }
            return req;
          }
          else if (paramType === Response)
            return res;
          else if (paramType.name === "String" || paramType.name === "Object") {
            return await Router.resolve(req, paramNames[i]) ?? req.params[paramNames[i]];
          } 
          else return container.resolve(paramType);
        })
      );
      const result = await handler.apply(this, args);

      if(result && !res.headersSent) {
        typeof result === "string"
          ? res.message(result)
          : res.api(result);
      }
    }
    catch(err) {
      if(err instanceof Validator.ValidationError)
        return res.status(400).message(err.details[0].message);
      next(err);
    }
  }
};
