import Middleware from "illuminate/middlewares/Middleware";
import {
  Request,
  Response,
  NextFunction
} from "express";

export default class ValidateSignature extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    return await req.hasValidSignature()
      ? next()
      : res.status(401).api({
        message: "Invalid signature!"
      });
  }
}