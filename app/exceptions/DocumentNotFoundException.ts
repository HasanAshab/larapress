import Exception from "~/core/abstract/Exception";
import { Request, Response } from "express";

export default class DocumentNotFoundException extends Exception {
  constructor(private modelName = "Resource") {
    super();
    this.modelName = modelName;
  }
  render(req: Request, res: Response) {
    res.status(404).message(this.modelName + " Not Found!");
  }
}