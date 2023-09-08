import { controller } from "~/core/decorators/class";
import { Request, Response } from "express";
import Attachment from "~/app/models/Attachment";

@controller
export default class FileController {
  async index(req: Request, res: Response) {
    const attachment = await Attachment.findById(req.params.id);
    attachment
      ? res.sendFile(attachment.path)
      : res.status(404).message();
  }
}