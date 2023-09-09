import { Request, Response, NextFunction } from "express";

export default abstract class Middleware {
  abstract handle(req: Request, res: Response, next: NextFunction): Promise<any>;
  
  constructor(public config: Record<string, unknown> = {}) {
    this.config = config;
  }
}