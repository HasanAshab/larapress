import { MiddlewareKeyWithOptions } from "types"; 

/**
 * Define middlewares path with a short name.
*/
export const middlewareAliases = {
  "auth": "~/app/http/middlewares/Authenticate",
  "verified": "~/app/http/middlewares/EnsureEmailIsVerified",
  "roles": "~/app/http/middlewares/CheckRole",
  "recaptcha": "~/app/http/middlewares/VerifyRecaptcha",
  "maintenance.check": "~/app/http/middlewares/CheckForMaintenanceMode",
  "limit": "~/app/http/middlewares/LimitRequestRate",
  "signed": "~/app/http/middlewares/ValidateSignature",
  "response.cache": "~/app/http/middlewares/CacheResponse",
  "global.responser": "~/app/http/middlewares/GlobalResponser",
  "error.handle": "~/app/http/middlewares/ErrorHandler"
};

/**
 * Register version specific global middlewares by its alias that will be execute
 * before every request of the app. Execution order depends on
 * the order of registration.
*/
export const globalMiddlewares: Record<string, MiddlewareKeyWithOptions[]> = {
  "v1": [
    "maintenance.check",
    "limit:1000,5"
  ]
}