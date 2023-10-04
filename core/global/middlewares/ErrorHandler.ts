import { Request, Response, NextFunction } from "express";
import Exception from "~/core/abstract/Exception";
import { log } from "~/core/utils";
import mongoose from "mongoose";

export default class ErrorHandler {
  async handle(err: any, req: Request, res: Response, next: NextFunction) {
    if(err instanceof Exception)
      return err.render(req, res);

    if(err.kind === "ObjectId")
      return res.status(404).message();
    
    log(`${new Date().toLocaleString()}\n${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
    return process.env.NODE_ENV === "production"
      ? res.status(500).message()
      : res.status(500).json({ error: err.stack });
  };
}