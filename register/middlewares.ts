const middlewares: Record<string, string | string[]> = {
  "test": "Test",
  "auth": "Authenticate",
  "verified": [
    "Authenticate",
    "EnsureEmailIsVerified"
  ],
  "admin": "CheckIfTheUserIsAdmin",
  "limit": "LimitRequestRate",
  "signed": "ValidateSignature",
  "validate": "ValidateRequest",
  "response.wrap": "WrapResponse",
  "response.cache": "CacheResponse",
  "error.handle": "ErrorHandler"
}

export default middlewares;