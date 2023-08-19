import Middleware from "illuminate/middlewares/Middleware";
import {
  Request,
  Response,
  NextFunction
} from "express";

export default class ValidateSignature extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { sign } = this.query;
    const hasValidSignature = typeof sign === "string" && await Token.isValid(this.baseUrl + this.path, "urlSignature", sign);
    return hasValidSignature
      ? next()
      : res.status(401).api({
        message: "Invalid signature!"
      });
  }
}