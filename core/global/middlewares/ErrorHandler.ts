import { Request, Response, NextFunction } from "express";
import { log } from "helpers";
import mongoose from "mongoose";

export default class ErrorHandler {
  async handle(err: any, req: Request, res: Response, next:NextFunction) {
    if(err.kind === "ObjectId")
      return res.status(404).api({});
    res.status(500);
    log(`${Date.now()}\n${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
    if(process.env.NODE_ENV === "production") res.api({});
    else res.json({ error: err.stack });
  };
}