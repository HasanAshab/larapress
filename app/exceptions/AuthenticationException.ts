import Exception from "~/core/exceptions/Exception";
import { Request, Response } from "express";

export default class AuthenticationException extends Exception {
  render(req: Request, res: Response) {
    res.status(401).message();
  }
}