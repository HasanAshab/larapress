import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "app/models/User";
import AuthenticationError from "app/exceptions/AuthenticationError";

export default class Authenticate extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.userId);
          if (user && user.tokenVersion === decoded.version) {
            req.user = user;
            return next();
          }
        } catch (err){
          if(err instanceof jwt.JsonWebTokenError) throw AuthenticationError.type("INVALID_OR_EXPIRED_TOKEN").create();
          throw err;
        }
      }
    }
    throw AuthenticationError.type("INVALID_OR_EXPIRED_TOKEN").create();
  }
}