import { Request, Response, NextFunction } from "express";
import { log } from "helpers";
import mongoose from "mongoose";
import { ResponseData } from "~/core/express";

export default class ErrorHandler {
  async handle(err: any, req: Request, res: Response, next:NextFunction) {
    if(err instanceof ResponseData)
      return res.status(err.statusCode).json(err.payload)
    if(err.kind === "ObjectId")
      return res.status(404).message();
    res.status(500);
    log(`${new Date().toLocaleString()}\n${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
    if(process.env.NODE_ENV === "production") res.api({});
    else res.json({ error: err.stack });
  };
}