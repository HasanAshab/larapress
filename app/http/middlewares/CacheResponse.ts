import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";

export default class CacheResponse extends Middleware {
  handle(req: Request, res: Response, next: NextFunction): void {
    const maxAge = this.options[0] || 5 * 60 * 1000;
    res.set('Cache-control', req.method === 'GET'? `public, max-age=${maxAge}` : 'no-store');
    next();
  }
}