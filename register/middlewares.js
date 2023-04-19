// Register all middlewares with a name
middlewares = {
  'auth': './app/http/middlewares/Authenticate',
  'verified': [
    './app/http/middlewares/Authenticate',
    './app/http/middlewares/EnsureEmailIsVerified'
  ],
  'admin': './app/http/middlewares/CheckIfTheUserIsAdmin',
  'limit': './app/http/middlewares/LimitRequestRate',
  'signed': './app/http/middlewares/ValidateSignature',
  'cache': './app/http/middlewares/CacheResponse',
  'validate': './app/http/middlewares/ValidateRequest',
  'error.handle': './app/http/middlewares/ErrorHandler',
}

module.exports = middlewares;