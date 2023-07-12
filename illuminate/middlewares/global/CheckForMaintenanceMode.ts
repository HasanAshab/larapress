import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";

export default class CheckForMaintenanceMode extends Middleware {
  handle(req: Request, res: Response, next: NextFunction) {
    if(process.env.APP_STATE === "down" && req.query.bypassKey !== process.env.APP_KEY){
      
      res.status(503).json({
        message: "Service Unavailable!"
      });
      
    }
    else next();
  }
}