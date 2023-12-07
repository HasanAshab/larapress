import Exception from "~/core/exceptions/Exception";
import { Request, Response } from "express";

export default class LoginAttemptLimitExceededException extends Exception {
  render(req: Request, res: Response) {
    res.status(429).message("Too Many Failed Attempts  again later!");
  }
}