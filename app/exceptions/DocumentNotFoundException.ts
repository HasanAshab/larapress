import Exception from "~/core/abstract/Exception";
import { Request, Response } from "express";

export default class DocumentNotFoundException extends Exception {
  render(req: Request, res: Response) {
    res.status(404).message("Document Not Found!");
  }
}