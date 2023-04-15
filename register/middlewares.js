// Register all middlewares with a name
middlewares = {
  'auth': './app/http/middlewares/Authenticate',
  'verified': './app/http/middlewares/EnsureEmailIsVerified',
  'admin': './app/http/middlewares/CheckIfTheUserIsAdmin',
  'limit': './app/http/middlewares/LimitRequestRate',
  'signed': './app/http/middlewares/ValidateSignature',
  'cache': './app/http/middlewares/CacheResponse',
  'upload': './app/http/middlewares/UploadFile',
  'error.log': './app/http/middlewares/LogErrorStack',
  'error.response': './app/http/middlewares/HandleClientError',
}

module.exports = middlewares;