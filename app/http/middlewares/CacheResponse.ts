import { Request, Response, NextFunction } from "express";


export default class CacheResponse {
  async handle(req: Request, res: Response, next: NextFunction, maxAge = 5 * 60 * 1000) {
    res.set("Cache-control", req.method === "GET"? `public, max-age=${maxAge}` : "no-store");
    next();
  }
}