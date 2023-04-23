const Media = require(base('app/models/Media'));

class MediaController {
  static index = async (req, res) => {
    const media = await Media.findById(req.params.id);
    return res.sendFile(media.path);
  }
  
  static serveStatic = (req, res) => {
    return res.sendFile(storage('static'));
  }
}

module.exports = MediaController;