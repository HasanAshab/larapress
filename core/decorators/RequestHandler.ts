import { constructor } from "types"; 
import { NextFunction } from "express";
import { Request, AuthenticRequest, Response, isRequest } from "~/core/express";
import Validator from "Validator";
import Router from "~/core/http/routing/Router";

export type HandlerParam = typeof Request | typeof Response | constructor;

export function resolveArguments(req: Request, res: Response, paramNames: string[], paramTypes: HandlerParam[]) {
  const resolveParamPromises = paramTypes.map(async (paramType, i) => {
    if (isRequest(paramType)) {
      const rules = paramType.rules();
      if(!rules) {
        return req;
      }
      const schema = Validator.object(rules);
      const data = req.method === "GET"
        ? req.query
        : Object.assign({}, req.body, req.files);
      const validated = await schema.validateAsync(data, { abortEarly: false });
      if(req.method === "GET") {
        req.query = validated;
      }
      else {
        req.body = validated;
      }
      return req;
    }
    
    else if (paramType === Response) {
      return res;
    }
    
    else if (paramType === String || paramType === Object) {
      return await Router.resolve(req, paramNames[i]) ?? req.params[paramNames[i]];
    } 
    
    else {
      return resolve(paramType);
    }
  });
    
  return Promise.all(resolveParamPromises);
}

export function sendResponse(res: Response, result: unknown) {
  if(!result) {
    res.end();
  }
  else if(typeof result === "string") {
    res.message(result);
  }
  else {
    res.json(result);
  }
}

export default function RequestHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const handler = descriptor.value;
  const paramNames = getParams(handler);
  const paramTypes: HandlerParam[] = Reflect.getMetadata("design:paramtypes", target, propertyKey);
  
  descriptor.value = async function(req: Request, res: Response, next: NextFunction){
    const args = await resolveArguments(req, res, paramNames, paramTypes);
    try {
      const result = await handler.apply(this, args);
      !res.headersSent && sendResponse(res, result);
    }
    catch(err) {
      next(err)
    }
  }
};


