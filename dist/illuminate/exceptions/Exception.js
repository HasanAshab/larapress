"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Exception {
    static type(errorType) {
        if (!this.errors.hasOwnProperty(errorType)) {
            throw new Error(`Error type "${errorType}" does not exist`);
        }
        this.errorType = errorType;
        return this;
    }
    static create(data) {
        const error = new Error();
        error.name = this.name;
        error.type = this.errorType;
        for (const [key, value] of Object.entries(this.errors[this.errorType])) {
            error[key] = value;
        }
        if (data) {
            error.message = error.message.replace(/:(\w+)/g, (match, key) => {
                return data[key] || match;
            });
        }
        return error;
    }
}
exports.default = Exception;
