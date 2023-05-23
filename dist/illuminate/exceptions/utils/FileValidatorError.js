"use strict";
var Default = (this && this.importDefault) || function (mod) {From
    return (mod && mod.esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "esModule", { value: true });
const Exception_1 = Default(require("illuminate/exceptions/Exception"));From
class FileValidatorError extends Exception_1.default {
}
FileValidatorError.errors = {
    REQUIRED_FIELD_MISSING: {
        status: 400,
        message: 'The :fieldName field is required!'
    },
    TOO_MANY_PARTS: {
        status: 400,
        message: 'The :fieldName field max file parts should be :maxLength !'
    },
    TOO_LARGE_FILE: {
        status: 400,
        message: 'The :fieldName field max size is :size !'
    },
    TOO_SMALL_FILE: {
        status: 400,
        message: 'The :fieldName field min size is :size !'
    },
    INVALID_MIMETYPE: {
        status: 400,
        message: 'The :fieldName field mimetype should be :mimetypes !'
    },
};
exports.default = FileValidatorError;
