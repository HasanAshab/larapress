import Middleware from "~/core/abstract/Middleware";
import { Request, Response, NextFunction } from "express";
import Config from "Config";
import jwt from "jsonwebtoken";
import User from "~/app/models/User";

export default class Authenticate extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const { sub, version, iss, aud } = jwt.verify(token, Config.get("app.key"))!;
        const user = await User.findById(sub);
        if (user !== null && version === user.tokenVersion && iss === Config.get("app.name") && aud === "auth") {
          req.user = user;
          return next();
        }
      }
    }
    res.status(401).message(); 
  }
}