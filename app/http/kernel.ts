import { MiddlewareKeyWithOptions } from "types"; 

/**
 * Define middlewares path with a short name.
*/
export const middlewareAliases = {
  "auth": "~/app/http/<version>/middlewares/Authenticate",
  "verified": "~/app/http/<version>/middlewares/EnsureEmailIsVerified",
  "roles": "~/app/http/<version>/middlewares/CheckRole",
  "recaptcha": "~/app/http/<version>/middlewares/VerifyRecaptcha",
  "maintenance.check": "~/app/http/<version>/middlewares/CheckForMaintenanceMode",
  "limit": "~/app/http/<version>/middlewares/LimitRequestRate",
  "signed": "~/app/http/<version>/middlewares/ValidateSignature",
  "response.cache": "~/app/http/<version>/middlewares/CacheResponse",
  "global.responser": "~/app/http/<version>/middlewares/GlobalResponser",
  "error.handle": "~/app/http/<version>/middlewares/ErrorHandler"
};

/**
 * Register global middlewares by its alias that will be execute
 * before every request of the app. Execution order depends on
 * the order of registration.
*/
export const globalMiddlewares: MiddlewareKeyWithOptions[] = [
  "maintenance.check",
  "limit:1000,5"
];