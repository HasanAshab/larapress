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
class CacheResponse extends Middleware_1.default {
    handle(req, res, next) {
        const maxAge = this.options[0] || 5 * 60 * 1000;
        res.set('Cache-control', req.method === 'GET' ? `public, max-age=${maxAge}` : 'no-store');
        next();
    }
}
__decorate([
    (0, method_1.passErrorsToHandler)()
], CacheResponse.prototype, "handle", null);
exports.default = CacheResponse;