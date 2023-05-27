import Middleware from "illuminate/middlewares/Middleware";
import {
  Request,
  Response,
  NextFunction
} from "express";
import {
  passErrorsToHandler
} from "illuminate/decorators/method";
import {
  base
} from "helpers";
import {
  isObject
} from "illuminate/guards";
import {
  ApiResponse,
  RawResponse
} from "types";

export default class WrapResponse extends Middleware {
  @passErrorsToHandler()
  async handle(req: Request, res: Response, next: NextFunction) {
    res.api = function (response: RawResponse) {
      if (res.headersSent) {
        return res;
      }
      const success = res.statusCode >= 200 && res.statusCode < 300;
      const wrappedData: ApiResponse = {success}
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
              //const data: Record<string, any> = {};
              //data[key] = value;
              wrappedData.data![key] = value;
            }
          }
        }
      } else if (Array.isArray(response)) {
        wrappedData.data = response;
      }
      return res.json(wrappedData);
    };
    next();
  }
}