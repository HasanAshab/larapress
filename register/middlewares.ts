export default {
  "auth": "Authenticate",
  "maintenance.check": "<global>/CheckForMaintenanceMode",
  "limit": "<global>/LimitRequestRate",
  "signed": "<global>/ValidateSignature",
  "validate": "<global>/ValidateRequest",
  "response.cache": "<global>/CacheResponse",
  "error.handle": "<global>/ErrorHandler",
  "helpers.inject": "<global>/InjectHelpers",
  "performance.trace": "<global>/TracePerformance"
} as const;