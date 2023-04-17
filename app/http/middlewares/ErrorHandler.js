const multer = require('multer');

module.exports = () => {
  return (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    log(`${req.originalUrl} - ${req.method} - ${req.ip}\nStatus: ${statusCode}\nStack: ${err.stack}`);
    
    if (err instanceof multer.MulterError){
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
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