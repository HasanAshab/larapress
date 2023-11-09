import { constructor } from "types"; 
import { Request, AuthenticRequest, Response, NextFunction, isRequest } from "~/core/express";
import Validator from "Validator";
import Router from "Router";

export default function RequestHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const handler = descriptor.value;
  const paramNames = getParams(handler);
  const paramTypes: (typeof Request | typeof Response | constructor)[] = Reflect.getMetadata("design:paramtypes", target, propertyKey);
  let rules: ReturnType<typeof Validator["object"]>;
  descriptor.value = async function(req: Request, res: Response, next: NextFunction){
    try {
      const args = await Promise.all(
        paramTypes.map(async (paramType, i) => {
          if (isRequest(paramType)) {
            if(paramType.rules) {
              rules = rules ?? Validator.object(paramType.rules());
              const data = req.method === "GET"
                ? req.query
                : Object.assign({}, req.body, req.files);
              const validated = await rules.validateAsync(data, { abortEarly: false });
              req[req.method === "GET" ? "query" : "body"] = validated;
            }
            return req;
          }
          else if (paramType === Response)
            return res;
          else if (paramType === String || paramType === Object) {
            return await Router.resolve(req, paramNames[i]) ?? req.params[paramNames[i]];
          } 
          else return resolve(paramType);
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
      next(err);
    }
  }
};


