import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import { passErrorsToHandler } from "illuminate/decorators/method";
import Cache from "illuminate/utils/Cache";

export default class ValidateSignature extends Middleware {
  @passErrorsToHandler()
  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const port = req.app.get("port") || req.socket.localPort;
    const fullUrl = `${req.protocol}://${req.hostname}:${port}${req.baseUrl}${req.path}`;
    const signature = req.query.s;
    if (typeof signature !== "undefined") {
      const signedSignature = await Cache.get(`__signed__${fullUrl}`);
      if (signedSignature && signedSignature === signature) {
        next();
      }
    } else {
      res.status(401).json({
        message: "Invalid signature!"
      });
    }
  }
}