import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import { log } from "helpers";
import mongoose from "mongoose";

export default class ErrorHandler extends Middleware {
  async handle(err: any, req: Request, res: Response, next:NextFunction) {
    let status = err.status ?? err.statusCode ?? 500;
    let message = err.message ?? "Internal server error!";
    if(err.kind === "ObjectId"){
      status = 404;
      message = undefined;
    }
    if(status === 500){
      log(`${Date.now()}\n${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
      if(process.env.NODE_ENV === "production") res.api({ status, message: "Internal server error!" });
      else res.status(status).json({error: err.stack});
    }
    else res.api({ status, message });
  };
}