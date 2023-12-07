import Exception from "~/core/exceptions/Exception";
import { Request, Response } from "express";

export default class HttpException extends Exception {
  constructor(private readonly message: string, private readonly status: number) {
    super();
    this.message = message;
    this.status = status;
  }

  render(req: Request, res: Response) {
    res.status(this.status).message(this.message);
  }
}