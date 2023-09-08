import Middleware from "~/core/abstract/Middleware";
import { Request, Response, NextFunction } from "express";
import RateLimit from "express-rate-limit";

export default class LimitRequestRate extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction){
    const [windowMs, max] = this.options;
    return await RateLimit({ windowMs, max })(req, res, next);
  }
}