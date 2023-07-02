import Middleware from "illuminate/middlewares/Middleware";
import { customError } from "helpers";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "app/models/User";

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
          if(err instanceof jwt.JsonWebTokenError) throw customError("INVALID_OR_EXPIRED_TOKEN");
          throw err;
        }
      }
    }
    throw customError("INVALID_OR_EXPIRED_TOKEN");
  }
}