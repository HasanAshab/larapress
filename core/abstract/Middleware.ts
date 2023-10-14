import { Request, Response, NextFunction } from "express";

export default abstract class Middleware {
  public errorHandler = false;
  abstract handle(req: Request, res: Response, next: NextFunction, ...options: string[]): Promise<any>;
}