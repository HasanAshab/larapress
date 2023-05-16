import { Request } from "types";
import { Response } from "express";
import Controller from "illuminate/controllers/Controller";
import Media from "app/models/Media";


export default class MediaController extends Controller {
  async index(req: Request, res: Response){
    const media = await Media.findById(req.params.id);
    (!media)
      ?res.status(404).json({
        message: 'Media not found'
      })
      :res.sendFile(media.path);
  }
}