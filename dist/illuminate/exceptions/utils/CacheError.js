"use strict";
var Default = (this && this.importDefault) || function (mod) {From
    return (mod && mod.esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "esModule", { value: true });
const Exception_1 = Default(require("illuminate/exceptions/Exception"));From
class CacheError extends Exception_1.default {
}
CacheError.errors = {
    INVALID_DRIVER: {
        message: 'The ":driver" Driver is Not Available',
        status: 500
    }
};
exports.default = CacheError;
