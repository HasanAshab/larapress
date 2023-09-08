import Middleware from "~/core/abstract/Middleware";
import { Request, Response, NextFunction } from "express";
import config from "config";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "~/app/models/User";

export default class Authenticate extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const { verified = true, roles } = this.config
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, config.get<any>("app.key")) as JwtPayload;
          const user = await User.findById(decoded.userId);
          if (user !== null && user.tokenVersion === decoded.version) {
            if(verified && !user.verified){
              return res.status(403).message("Your have to verify your email to perfom this action!");
            }
            if( 
              roles && (
                (Array.isArray(roles) && !roles.includes(user.role)) || roles !== user.role
              )
            ){
              return res.status(403).message("Your have not enough privilege to perfom this action!");
            }
            
            req.user = user;
            return next();
          }
        } catch (err){
          if(!(err instanceof jwt.JsonWebTokenError))
            throw err;
        }
      }
    }
    res.status(401).message(); 
  }
}