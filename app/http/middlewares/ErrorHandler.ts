import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import { passErrorsToHandler } from "illuminate/decorators/method";
import { base, log } from "helpers";

export default class ErrorHandler extends Middleware {
  @passErrorsToHandler()
  handle(err: any, req: Request, res: Response, next:NextFunction): Response<any, Record<string, any>> {
    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error!';
    if(status === 500){
      log(`${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
    }
    return (status === 500 && process.env.NODE_ENV === 'production')
      ?res.status(status).json({
        message: 'Internal server error!' 
      })
      :res.status(status).json({message});
  };
}