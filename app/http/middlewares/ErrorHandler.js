const multer = require('multer');

module.exports = () => {
  return (err, req, res, next) => {

    log(`${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
    
    return (process.env.NODE_ENV === 'production')
      ?res.status(500).json({
        success: false,
        message: 'Internal server error!' 
      })
      :res.status(500).json({
        success: false,
        message: err.stack
      });
  };
}