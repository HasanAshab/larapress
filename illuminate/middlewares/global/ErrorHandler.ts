import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import { base, log } from "helpers";

export default class ErrorHandler extends Middleware {
  handle(err: any, req: Request, res: Response, next:NextFunction) {
    const status = err.statusCode || err.status || 500;
    const message = err.message || "Internal server error!";
    if(status === 500){
      log(`${Date.now()}\n${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
      if(process.env.NODE_ENV === "production") res.status(status).json({message: "Internal server error!" });
      else res.api({status, message: err.stack})
    }
    else res.api({status, message});
  };
}