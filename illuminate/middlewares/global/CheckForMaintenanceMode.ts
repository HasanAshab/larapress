import Middleware from "~/illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import config from "config";

export default class CheckForMaintenanceMode extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { state, key } = config.get("app");
    if(state === "down" && req.query.bypassKey !== key)
      res.status(503).json({
        success: false,
        message: "Service Unavailable!"
      });
    else next();
  }
}