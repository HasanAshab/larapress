import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import { log } from "helpers";
import mongoose from "mongoose";

export default class ErrorHandler extends Middleware {
  handle(err: any, req: Request, res: Response, next:NextFunction) {
    if(err instanceof mongoose.CastError && err.kind === "ObjectId"){
      var status = 404;
      var message = "Resource Not Found"
    }
    else {
      var status = err.status ?? err.statusCode ?? 500;
      var message = err.message ?? "Internal server error!";
    }
    if(status === 500){
      log(`${Date.now()}\n${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
      if(process.env.NODE_ENV === "production") res.status(status).json({message: "Internal server error!" });
      else res.status(status).json({error: err.stack});
    }
    else res.status(status).json({message});
  };
}