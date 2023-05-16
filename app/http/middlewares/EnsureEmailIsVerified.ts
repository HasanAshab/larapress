import Middleware from "illuminate/middlewares/Middleware";
import { Response, NextFunction } from "express";
import { Request } from "types";
import { passErrorsToHandler } from "illuminate/decorators/method";

export default class EnsureEmailIsVerified extends Middleware {
  @passErrorsToHandler()
  handle(req: Request, res: Response, next:NextFunction) {
    if (req.user?.emailVerified) {
      return next();
    }
    res.status(401).json({
      message: "Your have to verify your email to perfom this action!",
    });
  }
}