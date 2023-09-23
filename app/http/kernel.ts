export const middlewareAliases = {
  "auth": "Authenticate",
  "verified": "<global>/EnsureEmailIsVerified",
  "roles": "<global>/CheckRole",
  "recaptcha": "<global>/VerifyRecaptcha",
  "maintenance.check": "<global>/CheckForMaintenanceMode",
  "limit": "<global>/LimitRequestRate",
  "signed": "<global>/ValidateSignature",
  "sanitize": "<global>/SanitizeRequest",
  "validate": "<global>/ValidateRequest",
  "response.cache": "<global>/CacheResponse",
  "error.handle": "<global>/ErrorHandler",
  "helpers.inject": "<global>/InjectHelpers",
};


export const globalMiddlewares = [
  "maintenance.check",
  "limit:1000,5"
];