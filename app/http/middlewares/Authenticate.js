const jwt = require('jsonwebtoken');
const User = model('User');

module.exports = (driver = 'web') => {
  const redirectTo = '/login';
  return async (req, res, next) => {
    try {
      let user = null;
      if (driver === 'web') {
        const userId = req.session.userId;
        if (userId) {
          user = await User.findById(userId);
        }
      } else if (driver === 'api') {
        const authHeader = req.headers.authorization;
        if (authHeader) {
          const token = authHeader.split(' ')[1];
          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            user = await User.findById(decoded.userId);
            if (user.tokenVersion !== decoded.version) {
              user = null;
            }
          }
        }
      }

      if (user) {
        req.user = user;
        return next();
      }

      return (driver === 'api')
      ? res.status(401).json({
        success: false,
        message: 'Invalid token!'
      }): res.redirect(redirectTo);
    }
    catch(err) {
      next(err)
    }
  }
}