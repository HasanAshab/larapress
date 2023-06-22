import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "app/models/User";
import AuthenticationError from "app/exceptions/AuthenticationError";

export default class Authenticate extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.APP_KEY ?? "") as JwtPayload;
          const user = await User.findById(decoded.userId);
          if (user !== null && user.tokenVersion === decoded.version) {
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