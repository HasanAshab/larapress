import Middleware from "illuminate/middlewares/Middleware";
import {
  Request,
  Response,
  NextFunction
} from "express";
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
      const {sign, exp = 0} = this.query;
      const signature = URL.createSignature(this.fullUrl() + exp);
      return sign === signature && (Number(exp) < 1 || Number(exp) > Date.now());
    }
    next()
  }
}