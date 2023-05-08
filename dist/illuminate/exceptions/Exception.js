"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Exception {
    static type(errorType) {
        if (!this.errors.hasOwnProperty(errorType)) {
            throw new Error(`Error type '${errorType}' does not exist`);
        }
        this.error = this.errors[errorType];
        this.error.type = errorType;
        this.error.name = this.name;
        return this;
    }
    static create(data) {
        if (data) {
            this.error.message = this.error.message.replace(/:(\w+)/g, (match, key) => {
                return data[key] || match;
            });
        }
        return this.error;
    }
}
exports.default = Exception;
