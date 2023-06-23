import { Request, Response } from "express";
import Media from "app/models/Media";

export default class MediaController {
  async t() {
    return {
      status: 500,
      a: 84,
      data: {b:"foo"}
    }
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