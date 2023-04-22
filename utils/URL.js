const cache = require('memory-cache');
const crypto = require('crypto');

class URL {
  static signedRoute = (routeName, data = null, expiryTime = null) => {
    const signature = URL.generateSignature();
    const fullUrl = route(routeName, data);
    const key = `__signed__${fullUrl}`;
    expiryTime
      ?cache.put(key, signature, expiryTime)
      :cache.put(key, signature);
    return `${fullUrl}?s=${signature}`;
  }

  static generateSignature = () => {
    return crypto.randomBytes(16).toString('hex');
  }
}

module.exports = URL