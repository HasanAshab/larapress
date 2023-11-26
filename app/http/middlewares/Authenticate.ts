import { Request, Response, NextFunction } from "express";
import { AuthenticRequest } from "~/core/express";
import Config from "Config";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "~/app/models/User";

export default class Authenticate {
  async handle(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).message(); 
    const { sub, version, iss, aud } = jwt.verify(token, Config.get("app.key")) as JwtPayload;
    const user = await User.findById(sub).includeHiddenFields();
    if (user && version === user.tokenVersion && iss === Config.get("app.name") && aud === "auth") {
      (req as AuthenticRequest).user = user;
      return next();
    }
    res.status(401).message(); 
  }
}