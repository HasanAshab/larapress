import { Request, Response, NextFunction } from "express";

export default class EnsureEmailIsVerified {
  async handle(req: Request, res: Response, next: NextFunction) {
    if(req.user?.verified)
      return next();
    res.status(403).message("Your have to verify your email to perfom this action!");
  }
}