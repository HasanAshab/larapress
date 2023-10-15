import Middleware from "~/core/abstract/Middleware";
import { Request, Response, NextFunction } from "express";
import Token from "~/app/models/Token";

export default class ValidateSignature extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const sign = req.query?.sign;
    const hasValidSignature = typeof sign === "string" && await Token.isValid(req.originalUrl, "urlSignature", sign);
    return hasValidSignature
      ? next()
      : res.status(401).api({
        message: "Invalid signature!"
      });
  }
}