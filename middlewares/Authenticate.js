const jwt = require('jsonwebtoken');

module.exports = (driver = 'web') => {
  return (req, res, next) => {
    if (driver === 'web') {
      if (!req.session.userId) {
        return res.redirect('/login');
      }
      next();
    } 
    else if (driver === 'api') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'Authorization header missing'
        });
      }
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token missing'
        });
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
    }
  }
}