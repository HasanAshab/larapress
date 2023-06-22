import Middleware from "illuminate/middlewares/Middleware";
import {
  Request,
  Response,
  NextFunction
} from "express";
import {
  ApiResponse,
  RawResponse
} from "types";
import {
  passErrorsToHandler
} from "illuminate/decorators/method";
import URL from "illuminate/utils/URL";
import Token from "illuminate/utils/Token";


export default class AppendRequestHelpers extends Middleware {
  @passErrorsToHandler()
  handle(req: Request, res: Response, next: NextFunction) {
    req.fullUrl = function(): string {
      const port = this.app.get("port") || this.socket.localPort;
      return`${this.protocol}://${this.hostname}:${port}${this.baseUrl}${this.path}`;
    }

    req.hasValidSignature = function(): boolean {
      const { sign } = this.query;
      console.log(this.baseUrl + this.path)
      return typeof sign === "string" && Token.isValid(this.baseUrl + this.path, sign);
    }

    res.api = function (response: RawResponse) {
      this.statusCode = response.status ?? this.statusCode;
      const success = this.statusCode >= 200 && this.statusCode < 300;
      delete response.status;
      const wrappedData: ApiResponse = {
        success,
        data: {}
      }
      for (const [key, value] of Object.entries(response)) {    
        if (key === "data") wrappedData.data = value;
        else if (key === "message") wrappedData.message = value;
        else wrappedData.data[key] = value;
      }
      return this.json(wrappedData);
    };

    next()
  }
}