import { Request, Response, NextFunction } from "express";
import Exception from "~/core/abstract/Exception";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Validator from "Validator";

export default class ErrorHandler {
  errorHandler = true;
  
  async handle(err: any, req: Request, res: Response, next: NextFunction) {
    if(err instanceof Exception)
      return err.render(req, res);
    if(err.kind === "ObjectId")
      return res.status(404).message();
    if(err instanceof jwt.JsonWebTokenError)
      return res.status(401).message("Invalid or expired token!");
    if(err instanceof Validator.ValidationError)
      return res.status(422).message(err.details[0].message);

    log(`${new Date().toLocaleString()}\n${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
    return process.env.NODE_ENV === "production"
      ? res.status(500).message()
      : res.status(500).json({ error: err.stack });
  };
}