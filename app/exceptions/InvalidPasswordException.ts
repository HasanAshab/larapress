import Exception from "~/core/exceptions/Exception";
import { Request, Response } from "express";

export default class InvalidPasswordException extends Exception {
  render(req: Request, res: Response) {
    res.status(401).message("Incorrect password! try again.");
  }
}