export default {
  /**
   * Define middlewares path with a short name.
  */
  aliases: {
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
  } as const
  
}