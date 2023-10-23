import Middleware from "~/core/abstract/Middleware";
import { Request, Response, NextFunction } from "express";
import config from "config";
import jwt from "jsonwebtoken";
import User from "~/app/models/User";

export default class Authenticate extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const { sub, version, iss, aud } = jwt.verify(token, config.get<any>("app.key"))!;
        const user = await User.findById(sub);
        if (user !== null && version === user.tokenVersion && iss === config.get("app.name") && aud === "auth") {
          req.user = user;
          return next();
        }
      }
    }
    res.status(401).message(); 
  }
}