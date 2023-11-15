import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { Request, Response } from "~/core/express";
import Media, { MediaDocument } from "~/app/models/Media";

export default class MediaController extends Controller {
  /**
   * Serve media files
  */
  @RequestHandler
  async index(req: Request, res: Response, media: MediaDocument) {
    if(media.visibility === "private" && !req.hasValidSignature)
      return res.status(401).message("Invalid signature!");
    res.sendFileFromStorage(media.path);
  }
}