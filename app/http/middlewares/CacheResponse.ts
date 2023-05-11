import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import Cache from "illuminate/utils/Cache";

export default class CacheResponse extends Middleware {
  handle(req: Request, res: Response, next:NextFunction): Response<any, Record<string, any>> {
    res.set('Cache-controll', (req.method === 'GET') ? `public, max-age=${this.options[0]}` : 'no-store');
    next();
  }
}