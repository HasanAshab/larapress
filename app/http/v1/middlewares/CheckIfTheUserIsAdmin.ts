import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";

export default class CheckIfTheUserIsAdmin extends Middleware {
  handle(req: Request, res: Response, next: NextFunction) {
    if(req.user?.isAdmin){
      next();
    }
    res.status(401).api({
      message: "Only admin can perform this action!"
    });
  }
}