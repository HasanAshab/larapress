import Middleware from "illuminate/middlewares/Middleware";
import { base, isObject } from "helpers";
import { Request, Response, NextFunction } from "express";
import { WrappedResponse, UnwrappedResponse } from "types";
import { passErrorsToHandler } from "illuminate/decorators/class";

@passErrorsToHandler
export default class WrapResponse extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    throw new Error
    const originalJson = res.json;
    res.json = function (response: UnwrappedResponse): Response<any, Record<string, any>> {
      const success = res.statusCode >= 200 && res.statusCode < 300;
      const wrappedData: WrappedResponse = { success }
      if (isObject(response)) {
        wrappedData.data = {};
        for (const [key, value] of Object.entries(response)) {
          if (key === "data") {
            wrappedData.data = value;
          } else if (key === "message") {
            wrappedData.message = value;
          } else {
            if (key === "data") {
              wrappedData.data = value;
            } else {
              const data: {[key: string]: any} = {};
              data[key] = value;
              wrappedData.data = { ...wrappedData.data, data};
            }
          }
        }
      } else if(Array.isArray(response)){
        wrappedData.data = response;
      }
      return originalJson.call(res, wrappedData);
    };
    next();
  }
}