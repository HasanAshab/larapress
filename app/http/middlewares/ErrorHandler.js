const Middleware = require(base("illuminate/middlewares/Middleware"));

class ErrorHandler extends Middleware{
  handle(err, req, res, next){
    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error!';
    if(status === 500){
      log(`${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
    }
    return (status === 500 && process.env.NODE_ENV === 'production')
      ?res.status(status).json({
        message: 'Internal server error!' 
      })
      :res.status(status).json({
        message: message
      });
  };
}

module.exports = ErrorHandler;