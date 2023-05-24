"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares = {
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
};
exports.default = middlewares;
