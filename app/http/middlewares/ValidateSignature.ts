import { Request, Response } from "~/core/express";
import { NextFunction } from "express";

export default class ValidateSignature {
  async handle(req: Request, res: Response, next: NextFunction) {
    if(req.hasValidSignature)
      return next()
    res.status(401).message("Invalid signature!");
  }
}