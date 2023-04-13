const RateLimit = require('express-rate-limit');

module.exports = (requestCount) => {
  return RateLimit({
    windowMs: 60 * 1000, // 1 min
    max: requestCount
  });
}