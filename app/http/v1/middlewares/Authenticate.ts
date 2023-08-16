import Middleware from "illuminate/middlewares/Middleware";
import { customError } from "helpers";
import { Request, Response, NextFunction } from "express";
import config from "config";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "app/models/User";

export default class Authenticate extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const { verified = true, roles = [] } = this.config
    
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, config.get("app.key")) as JwtPayload;
          const user = await User.findById(decoded.userId);
          if (user !== null && user.tokenVersion === decoded.version) {
            if(verified && !user.verified){
              console.log("heh", user)
              return res.status(401).api({
                message: "Your have to verify your email to perfom this action!"
              });
            }
            if(Array.isArray(roles) && roles.length > 0 && !roles.includes(user.role)){
              return res.status(403).api({
                message: "Your have not enough privilege to perfom this action!"
              });
            }
            
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