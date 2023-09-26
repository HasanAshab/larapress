import { Request, Response } from "~/core/express";
import { container } from 'tsyringe';
import { getParams } from "helpers";

export default function RequestHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const handler = descriptor.value;
  const paramNames = getParams(handler);
  const paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);
  console.log(paramTypes, paramNames)
  const args = [];
  descriptor.value = async function(req, res, next) {
    try {
      for(let i = 0; i < paramNames.length; i++) {
        const paramType = paramTypes[i];
        const paramName = paramNames[i];
        if(paramType === Request) {
          args.push(req);
        }
        else if(paramType.prototype instanceof Request) {
          console.log("Validate it!")
          args.push(req);
        }
        else if(paramType === Response){
          args.push(res);
        }
        else if(paramType.name === "String" || paramType.name === "Object"){
          args.push(req.params[paramName]);
        }
        else {
          args.push(container.resolve(paramType));
        }
      }

      await handler.apply(target, args);
    }
    catch(err) {
      next(err)
    }
  }
};
