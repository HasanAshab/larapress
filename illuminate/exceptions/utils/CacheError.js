const Exception = require(base('illuminate/exceptions/Exception'));

class CacheError extends Exception {
  static errors = {
    INVALID_DRIVER: {
      message: 'The ":driver" Driver is Not Available',
      status: 500
    }
  }
}

module.exports = CacheError;