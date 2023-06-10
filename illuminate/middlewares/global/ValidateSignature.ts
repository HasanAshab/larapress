import Middleware from "illuminate/middlewares/Middleware";
import {
  Request,
  Response,
  NextFunction
} from "express";
import {
  passErrorsToHandler
} from "illuminate/decorators/method";

export default class ValidateSignature extends Middleware {
  @passErrorsToHandler()
  async handle(req: Request, res: Response, next: NextFunction) {
    return req.hasValidSignature()
      ?next()
      : res.status(401).api({
        message: "Invalid signature!"
      });
  }
}