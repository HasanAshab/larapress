const Middleware = require(base('illuminate/middlewares/Middleware'));
const Cache = require(base("illuminate/utils/Cache"));

class CacheResponse extends Middleware {
 handle(req, res, next){
    const key = '__route__' + req.originalUrl || req.url;
    const cachedBody = Cache.get(key);
    if (cachedBody) {
      return res.json(cachedBody);
    }
    else {
      res.sendResponse = res.json;
      res.json = (body) => {
        Cache.put(key, body, this.options[0]);
        res.sendResponse(body);
      };
      next();
    }
  }
}

module.exports = CacheResponse;