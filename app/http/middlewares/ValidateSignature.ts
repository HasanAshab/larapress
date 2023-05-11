import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import { passErrorsToHandler } from "illuminate/decorators/method";
import Cache from "illuminate/utils/Cache";

export default class ValidateSignature extends Middleware {
  @passErrorsToHandler()
  handle(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> {
    const port = req.app.get('port') || req.socket.localPort;
    const fullUrl = `${req.protocol}://${req.hostname}:${port}${req.baseUrl}${req.path}`;
    const signature = req.query.s;
    if(typeof signature !== 'undefined'){
      const signedSignature = Cache.get(`__signed__${fullUrl}`);
      if(signedSignature && signedSignature === signature){
        return next();
      }
    }
    return res.status(401).json({
      message: 'Invalid signature!'
    });
  }
}