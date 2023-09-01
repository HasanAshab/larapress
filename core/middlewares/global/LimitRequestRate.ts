import Middleware from "~/core/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import RateLimit from "express-rate-limit";

export default class LimitRequestRate extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction){
    const {time = 60 * 1000, count = 60} = this.config;
    if(typeof time !== "number" || typeof count !== "number") throw new Error("time and count args required as type Number.");
    
    return RateLimit({
      windowMs: time,
      max: count,
    })(req, res, next);
  }
}