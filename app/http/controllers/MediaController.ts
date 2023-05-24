import {
  Request,
  Response
} from "express";
import {
  passErrorsToHandler
} from "illuminate/decorators/class";
import Controller from "illuminate/controllers/Controller";
import Media from "app/models/Media";

@passErrorsToHandler
class MediaController extends Controller {
  async index(req: Request, res: Response) {
    const media = await Media.findById(req.validated.id);
    (!media)
    ?res.status(404).json({
      message: "Media not found"
    }): res.sendFile(media.path);
  }
}

export default new MediaController;