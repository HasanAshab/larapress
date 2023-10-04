import Exception from "~/core/abstract/Exception";
import { Request, Response } from "express";

export default class ApiException extends Exception {
  constructor(private readonly message: string, private readonly status: number) {
    this.message = message;
    this.status = status;
  }

  render(req: Request, res: Response) {
    res.status(this.status).message(this.message);
  }
}