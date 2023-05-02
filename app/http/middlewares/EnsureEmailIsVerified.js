const Middleware = require(base("illuminate/middlewares/Middleware"));

class EnsureEmailIsVerified extends Middleware {
  handle(req, res, next) {
    if (req.user.emailVerified) {
      return next();
    }
    return res.status(401).json({
      message: "Your have to verify your email to perfom this action!",
    });
  }
}

module.exports = EnsureEmailIsVerified;
