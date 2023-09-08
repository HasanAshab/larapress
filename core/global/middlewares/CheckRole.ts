import Middleware from "~/core/abstract/Middleware";
import { Request, Response, NextFunction } from "express";

export default class CheckRole extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    if(this.options.includes(req.user.role))
      return next();
    res.status(403).message();
  }
}