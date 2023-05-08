import Exception from 'illuminate/exceptions/Exception';

export default class AuthenticationError extends Exception {
  static errors = {
    INVALID_OR_EXPIRED_TOKEN: {
      status: 401,
      message: 'Invalid or expired token!'
    },
    
    PASSWORD_SHOULD_DIFFERENT: {
      status: 400,
      message: 'New password should not be same as old one!'
    },
  }
}

