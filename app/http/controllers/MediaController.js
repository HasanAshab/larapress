const Controller = require(base('illuminate/controllers/Controller'));
const Media = require(base('app/models/Media'));

class MediaController extends Controller{
  async index(req, res){
    const media = await Media.findById(req.params.id);
    return res.sendFile(media.path);
  }
}

module.exports = MediaController;