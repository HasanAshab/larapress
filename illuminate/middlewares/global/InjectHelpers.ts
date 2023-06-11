import Middleware from "illuminate/middlewares/Middleware";
import {
  Request,
  Response,
  NextFunction
} from "express";
import { ApiResponse, RawResponse } from "types";
import {
  passErrorsToHandler
} from "illuminate/decorators/method";
import URL from "illuminate/utils/URL";

export default class AppendRequestHelpers extends Middleware {
  @passErrorsToHandler()
  handle(req: Request, res: Response, next: NextFunction) {
    req.fullUrl = function(): string {
      const port = this.app.get("port") || this.socket.localPort;
      return`${this.protocol}://${this.hostname}:${port}${this.baseUrl}${this.path}`;
    }
    
    req.hasValidSignature = function(): boolean {
      console.log(this.originalUrl)
      const { sign, exp = 0 } = this.query;
      const signature = URL.createSignature(`${this.baseUrl}${this.path}${exp}`);
      return sign === signature && (Number(exp) < 1 || Number(exp) > Date.now());
    }

    res.api = function (response: RawResponse) {
      if (res.headersSent) {
        return res;
      }
      const success = res.statusCode >= 200 && res.statusCode < 300;
      const wrappedData: ApiResponse = {
        success
      }
      if (Array.isArray(response)) {
        wrappedData.data = response;
      }
      else {
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
      }
      return res.json(wrappedData);
    };

    next()
  }
}