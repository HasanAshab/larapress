import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";

export default class EnsureEmailIsVerified extends Middleware {
  handle(req: Request, res: Response, next:NextFunction) {
    if (req.user?.verified) {
      return next();
    }
    res.status(401).api({
      message: "Your have to verify your email to perfom this action!",
    });
  }
}