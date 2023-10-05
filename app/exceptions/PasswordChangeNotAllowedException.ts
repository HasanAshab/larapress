import Exception from "~/core/abstract/Exception";
import { Request, Response } from "express";

export default class PasswordChangeNotAllowedException extends Exception {
  render(req: Request, res: Response) {
    res.status(403).message("Changing passwords is not allowed for OAuth users!");
  }
}