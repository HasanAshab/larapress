import Middleware from "~/core/abstract/Middleware";
import { Request, Response, NextFunction } from "express";
import URL from "URL";

export default class ValidateSignature extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    if(await URL.hasValidSignature(req.fullUrl()))
      return next()
    res.status(401).message("Invalid signature!");
  }
}