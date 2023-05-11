const cache = require('memory-cache');
const crypto = require('crypto');

//TODO cache driver based

class URL {
  static signedRoute(routeName, data = null, expiryTime = null){
    const signature = crypto.randomBytes(16).toString('hex');
    const fullUrl = route(routeName, data);
    const key = `__signed__${fullUrl}`;
    expiryTime
      ?cache.put(key, signature, expiryTime)
      :cache.put(key, signature);
    return `${fullUrl}?s=${signature}`;
  }
}

module.exports = URL