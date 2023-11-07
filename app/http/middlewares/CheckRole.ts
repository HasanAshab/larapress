import { AuthenticRequest, Response } from "~/core/express";
import { NextFunction } from "express";

export default class CheckRole {
  async handle(req: AuthenticRequest, res: Response, next: NextFunction, ...roles: string[]) {
    if(roles.includes(req.user.role))
      return next();
    res.status(403).message();
  }
}