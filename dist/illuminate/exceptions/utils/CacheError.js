"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exception_1 = __importDefault(require("illuminate/exceptions/Exception"));
class CacheError extends Exception_1.default {
}
CacheError.errors = {
    INVALID_DRIVER: {
        message: "The ":driver" Driver is Not Available",
        status: 500
    }
};
exports.default = CacheError;
