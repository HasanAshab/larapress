const jwt = require("jsonwebtoken");
const User = require(base("app/models/User"));
const AuthenticationError = require(base("app/exceptions/AuthenticationError"));

module.exports = () => {
  return async (req, res, next) => {
    try {
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
    } catch (err) {
      next(err);
    }
  };
};
