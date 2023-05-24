"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exception_1 = __importDefault(require("illuminate/exceptions/Exception"));
class FileValidatorError extends Exception_1.default {
}
FileValidatorError.errors = {
    REQUIRED_FIELD_MISSING: {
        status: 400,
        message: "The :fieldName field is required!"
    },
    TOO_MANY_PARTS: {
        status: 400,
        message: "The :fieldName field max file parts should be :maxLength !"
    },
    TOO_LARGE_FILE: {
        status: 400,
        message: "The :fieldName field max size is :size !"
    },
    TOO_SMALL_FILE: {
        status: 400,
        message: "The :fieldName field min size is :size !"
    },
    INVALID_MIMETYPE: {
        status: 400,
        message: "The :fieldName field mimetype should be :mimetypes !"
    },
};
exports.default = FileValidatorError;
