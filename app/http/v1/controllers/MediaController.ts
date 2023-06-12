import { Request, Response } from "express";
import { passErrorsToHandler } from "illuminate/decorators/class";
import Controller from "illuminate/controllers/Controller";
import Media from "app/models/Media";

@passErrorsToHandler
export default class MediaController extends Controller {
  async t() {
    return {a:"ej"}
  }
  
  async index(req: Request, res: Response) {
    const media = await Media.findById(req.validated.id);
    (!media)
    ?res.status(404).api({
      message: "Media not found"
    })
    : res.sendFile(media.path);
  }
}