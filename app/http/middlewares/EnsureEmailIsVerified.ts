import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";

export default class EnsureEmailIsVerified extends Middleware {
  handle(req: Request, res: Response, next:NextFunction): Response<any, Record<string, any>> {
    if (req.user?.emailVerified) {
      return next();
    }
    return res.status(401).json({
      message: "Your have to verify your email to perfom this action!",
    });
  }
}