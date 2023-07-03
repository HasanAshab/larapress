import { Request, Response } from "express";
import Attachment from "app/models/Attachment";

export default class FileController {
  async index(req: Request, res: Response) {
    const attachment = await Attachment.findById(req.validated.id);
    (!attachment)
    ?res.status(404).api({
      message: "File not found."
    })
    : res.sendFile(attachment.path);
  }
}