const Middleware = require(base("illuminate/middlewares/Middleware"));
const jwt = require("jsonwebtoken");
const User = require(base("app/models/User"));
const AuthenticationError = require(base("app/exceptions/AuthenticationError"));

class Authenticate extends Middleware {
  async handle(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          user = await User.findById(decoded.userId);
          if (user.tokenVersion === decoded.version) {
            req.user = user;
            return next();
          }
        } catch {
          new AuthenticationError().throw("INVALID_OR_EXPIRED_TOKEN");
        }
      }
    }
    new AuthenticationError().throw("INVALID_OR_EXPIRED_TOKEN");
  }
}

module.exports = Authenticate;
