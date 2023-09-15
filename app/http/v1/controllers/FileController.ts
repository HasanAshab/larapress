import { controller } from "~/core/decorators/class";
import { Request, Response } from "express";

@controller
export default class FileController {
  async index(req: Request, res: Response) {
    return res.sendFile(req.params.path)
  }
}