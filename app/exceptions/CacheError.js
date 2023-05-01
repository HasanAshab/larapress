const Exception = require(base('illuminate/exceptions/Exception'));

class CacheError extends Exception {
  errors = {
    INVALID_DRIVER:{
      message: 'The : Driver is Not Available',
      status: 500
    }
  }
}

module.exports = CacheError;