import { AuthenticRequest, Response } from "~/core/express";
import { NextFunction } from "express";

export default class EnsureEmailIsVerified {
  async handle(req: AuthenticRequest, res: Response, next: NextFunction) {
    if(req.user.verified)
      return next();
    res.status(403).message("Your have to verify your email to perfom this action!");
  }
}