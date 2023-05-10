import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";

export default class CheckIfTheUserIsAdmin extends Middleware {
  handle(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> {
    if(req.user?.isAdmin){
      next();
    }
    return res.status(401).json({
      message: "Only admin can perform this action!"
    });
  }
}