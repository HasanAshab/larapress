"use strict";
var importDefault = (this && this.importDefault) || function (mod) {
    return (mod && mod.esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "esModule", { value: true });
const Exception_1 = importDefault(require("illuminate/exceptions/Exception"));
class CacheError extends Exception_1.default {
}
CacheError.errors = {
    INVALID_DRIVER: {
        message: 'The ":driver" Driver is Not Available',
        status: 500
    }
};
exports.default = CacheError;
