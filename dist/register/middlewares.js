"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "auth": "Authenticate",
    "verified": [
        "Authenticate",
        "EnsureEmailIsVerified"
    ],
    "admin": "CheckIfTheUserIsAdmin",
    "limit": "<global>/LimitRequestRate",
    "signed": "<global>/ValidateSignature",
    "validate": "<global>/ValidateRequest",
    "response.cache": "<global>/CacheResponse",
    "error.handle": "<global>/ErrorHandler",
    "helpers.inject": "<global>/InjectHelpers"
};
