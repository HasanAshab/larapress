"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Middleware_1 = __importDefault(require("illuminate/middlewares/Middleware"));
const method_1 = require("illuminate/decorators/method");
const helpers_1 = require("helpers");
class ErrorHandler extends Middleware_1.default {
    handle(err, req, res, next) {
        const status = err.statusCode || err.status || 500;
        const message = err.message || 'Internal server error!';
        if (status === 500) {
            (0, helpers_1.log)(`${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
        }
        return (status === 500 && process.env.NODE_ENV === 'production')
            ? res.status(status).json({
                message: 'Internal server error!'
            })
            : res.status(status).json({ message });
    }
    ;
}
__decorate([
    (0, method_1.passErrorsToHandler)()
], ErrorHandler.prototype, "handle", null);
exports.default = ErrorHandler;
