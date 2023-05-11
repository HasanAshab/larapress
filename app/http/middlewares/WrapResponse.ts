import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import { passErrorsToHandler } from "illuminate/decorators/method";
import { base, isObject } from "helpers";
import { WrappedResponse, UnwrappedResponse } from "types";

export default class WrapResponse extends Middleware {
  @passErrorsToHandler()
  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
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