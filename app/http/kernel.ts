import { MiddlewareKeyWithOptions } from "types"; 

/**
 * Define middlewares with a short name.
 * It searches on app/http/{version}/middlewares folder.
 * <global> maps to core/global/middlewares folder, use that for 
 * version independent middleware.
*/
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
  "global.responser": "<global>/GlobalResponser",
  "error.handle": "<global>/ErrorHandler",
  "helpers.inject": "<global>/InjectHelpers",
};

/**
 * Register global middlewares by its alias that will be execute
 * before every request of the app. Execution order depends on
 * the order of registration.
*/
export const globalMiddlewares: MiddlewareKeyWithOptions[] = [
  "helpers.inject",
  "maintenance.check",
  "limit:1000,5"
];