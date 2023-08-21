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
      message = "Resource Not Found!";
    }
    res.status(status);
    if(status === 500){
      log(`${Date.now()}\n${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
      if(process.env.NODE_ENV === "production") res.json({ message: "Internal server error!" });
      else res.json({error: err.stack});
    }
    else res.json({ message });
  };
}