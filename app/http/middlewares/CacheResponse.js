const Cache = require(base("illuminate/utils/Cache"));

module.exports = (expiryTime = 2 * 60 * 1000) => {
  return (req, res, next) => {
    const key = '__route__' + req.originalUrl || req.url;
    const cachedBody = Cache.get(key);
    if (cachedBody) {
      return res.json(cachedBody);
    }
    else {
      res.sendResponse = res.json;
      res.json = (body) => {
        Cache.put(key, body, expiryTime);
        res.sendResponse(body);
      };
      next();
    }
  }
}