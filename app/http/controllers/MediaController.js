const CatchAllMethodErrors = require(base("utils/CatchAllMethodErrors"));
const Media = require(base('app/models/Media'));

class MediaController {
  static index = async (req, res) => {
    const media = await Media.findById(req.params.id);
    return res.sendFile(media.path);
  }
}


CatchAllMethodErrors.wrapMethods(MediaController);
module.exports = MediaController;