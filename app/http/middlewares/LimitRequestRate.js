const Middleware = require(base("illuminate/middlewares/Middleware"));
const RateLimit = require("express-rate-limit");

class LimitRequestRate extends Middleware {
  handle() {
    return RateLimit({
      windowMs: 60 * 1000, // 1 min
      max: this.options[0],
    });
  }
}

module.exports = LimitRequestRate;
