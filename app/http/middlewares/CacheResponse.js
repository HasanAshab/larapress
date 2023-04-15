const cache = require('memory-cache');

module.exports = (expiryTime = 2 * 60 * 1000) => {
  return (req, res, next) => {
    const key = '__route__' + req.originalUrl || req.url;
    const cachedBody = cache.get(key);
    if (cachedBody) {
      return res.json(cachedBody);
    }
    else {
      res.sendResponse = res.json;
      res.json = (body) => {
        cache.put(key, body, expiryTime);
        res.sendResponse(body);
      };
      next();
    }
  }
}