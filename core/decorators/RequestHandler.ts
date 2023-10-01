import { Request, AuthenticRequest } from "~/core/express";
import { container } from 'tsyringe';
import { getParams } from "helpers";
import Validator from "Validator";

export default function RequestHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const handler = descriptor.value;
  const paramNames = getParams(handler);
  const paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);
  let rules = null;
  descriptor.value = async (req, res, next) => {
    try {
      const args = [];
      for(let i = 0; i < paramNames.length; i++) {
        const paramType = paramTypes[i];
        const paramName = paramNames[i];
        if(paramType === Request || paramType === AuthenticRequest)
          args.push(req);
        else if(paramType.prototype instanceof Request) {
          rules = rules ?? Validator.object(new paramType().rules());
          const data = req.method === "get"
            ? req.query
            : Object.assign({}, req.body, req.files);
          const { error, value } = rules.validate(data);
          if(error)
            return res.status(400).message(error.details[0].message);
          req.body = value;
          args.push(req);
        }
        else if(paramName === "res")
          args.push(res)
        else if(paramType.name === "String" || paramType.name === "Object")
          args.push(req.params[paramName]);
        else args.push(container.resolve(paramType));
      }
      const result = await handler.apply(target, args);
      //result && res.api(result);
    }
    catch(err) {
      next(err)
    }
  }
};
