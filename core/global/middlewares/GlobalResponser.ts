import Middleware from "~/core/abstract/Middleware";
import { Request, Response, NextFunction } from "express";
import { ResponseData } from "~/core/express";

export default class GlobalResponser extends Middleware {
  async handle(err: any, req: Request, res: Response, next: NextFunction) {
    if(err instanceof ResponseData)
      return err.send(res);
    next(err);
  }
}