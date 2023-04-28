module.exports = () => {
  return (err, req, res, next) => {
    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error!';
    log(`${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
    
    return (status === 500 && process.env.NODE_ENV === 'production')
      ?res.status(status).json({
        success: false,
        message: 'Internal server error!' 
      })
      :res.status(status).json({
        success: false,
        message: message
      });
  };
}