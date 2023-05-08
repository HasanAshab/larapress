import Exception from 'illuminate/exceptions/Exception';

export default class CacheError extends Exception {
  static errors = {
    INVALID_DRIVER: {
      message: 'The ":driver" Driver is Not Available',
      status: 500
    }
  }
}

