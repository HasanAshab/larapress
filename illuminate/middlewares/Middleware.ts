import { Request, Response, NextFunction } from "express";
import { passErrorsToHandler } from 'illuminate/utils';

export default abstract class Middleware {
  abstract handle(req: Request, res: Response, next: NextFunction): void;
  
  constructor(public options: string[] = []) {
    this.options = options;
    //this.handle = passErrorsToHandler(this.handle.bind(this));
  }
}