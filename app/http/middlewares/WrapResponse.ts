import Middleware from "illuminate/middlewares/Middleware";
import { base, isObject } from "helpers";
import { Request, Response, NextFunction } from "express";


export default class WrapResponse extends Middleware {
  
  handle(req: Request, res: Response, next: NextFunction): void {
    throw new Error
    const originalJson = res.json;
    type ResponseObject = {[key: string]: any};
    res.json = function (response: ResponseObject): Response<any, Record<string, any>> {
      const { data, message } = response;
      const success = res.statusCode >= 200 && res.statusCode < 300;
      const wrappedData: ResponseObject = { success };
      if (isObject(response)) {
        wrappedData.data = {};
        for (const [key, value] of Object.entries(response)) {
          if (["data", "message"].includes(key)) {
            wrappedData[key] = value;
          } else {
            if (key === "data") {
              wrappedData.data = value;
            } else {
              wrappedData.data![key] = value;
            }
          }
        }
      } else {
        wrappedData.data = response;
      }
      return originalJson.call(res, wrappedData);
    };
    next();
  }
}