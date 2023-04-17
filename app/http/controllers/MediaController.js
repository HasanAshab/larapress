const Media = model('Media');

class MediaController {
  static index = async (req, res) => {
    try{
      const media = await Media.findById(req.params.id);
      return res.sendFile(media.path);
    }
    catch (err) {
      res.status(404).json({
        success: false,
        message: 'Media not found!'
      });
    }
  }
}

module.exports = MediaController;