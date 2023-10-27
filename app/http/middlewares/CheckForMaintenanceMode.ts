import { Request, Response, NextFunction } from "express";
import Config from "Config";

export default class CheckForMaintenanceMode {
  async handle(req: Request, res: Response, next: NextFunction) {
    if(Config.get("app.state") === "down" && req.query.bypassKey !== Config.get("app.key"))
      return res.status(503).message("Service Unavailable!");
    next();
  }
}