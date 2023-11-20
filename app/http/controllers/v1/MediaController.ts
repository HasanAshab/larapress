import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { Request, Response } from "~/core/express";
import Media, { IMedia } from "~/app/models/Media";

export default class MediaController extends Controller {
  /**
   * Serve media files
  */
  @RequestHandler
  async __invoke(req: Request, res: Response, rawMedia: IMedia) {
    if(media.visibility === "private" && !req.hasValidSignature)
      return res.status(401).message("Invalid signature!");
    res.sendFileFromStorage(media.path);
  }
}