export default {
  "auth": "Authenticate",
  "verified": [
    "Authenticate",
    "EnsureEmailIsVerified"
  ],
  "admin": "CheckIfTheUserIsAdmin",
  "limit": "<global>/LimitRequestRate",
  "signed": "<global>/ValidateSignature",
  "validate": "<global>/ValidateRequest",
  "response.wrap": "<global>/WrapResponse",
  "response.cache": "<global>/CacheResponse",
  "error.handle": "<global>/ErrorHandler",
  "helpers.inject": "<global>/InjectHelpers"
};