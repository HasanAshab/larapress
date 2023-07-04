import { Request, Response } from "express";
import Attachment from "app/models/Attachment";

export default class FileController {
  async index(req: Request, res: Response) {
    const attachment = await Attachment.findById(req.params.id);
    (!attachment)
    ?res.api({status: 404})
    : res.sendFile(attachment.path);
  }
}