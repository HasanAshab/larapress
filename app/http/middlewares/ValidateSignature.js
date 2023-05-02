const Middleware = require(base("illuminate/middlewares/Middleware"));
const Cache = require(base("illuminate/utils/Cache"));

class ValidateSignature extends Middleware {
  handle(req, res, next){
    const port = req.app.get('port') || req.socket.localPort;
    const fullUrl = `${req.protocol}://${req.hostname}:${port}${req.baseUrl}${req.path}`;
    const signature = req.query.s;
    if(signature){
      const signedSignature = Cache.get(`__signed__${fullUrl}`);
      if(signedSignature && signedSignature === signature){
        return next()
      }
    }
    return res.status(401).json({
      message: 'Invalid signature!'
    });
  }
}

module.exports = ValidateSignature;