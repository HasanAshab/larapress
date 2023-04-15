const cache = require('memory-cache');

module.exports = () => {
  return (req, res, next) => {
    const port = req.app.get('port') || req.socket.localPort;
    const fullUrl = `${req.protocol}://${req.hostname}:${port}${req.baseUrl}${req.path}`;
    const signature = req.query.s;
    if(signature){
      const signedSignature = cache.get(`__signed__${fullUrl}`);
      if(signedSignature && signedSignature === signature){
        return next()
      }
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid signature!'
    });
  }
}