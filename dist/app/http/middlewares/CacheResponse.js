"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Middleware_1 = __importDefault(require("illuminate/middlewares/Middleware"));
class CacheResponse extends Middleware_1.default {
    handle(req, res, next) {
        const maxAge = this.options[0] || 5 * 60 * 1000;
        res.set('Cache-control', req.method === 'GET' ? `public, max-age=${maxAge}` : 'no-store');
        next();
    }
}
exports.default = CacheResponse;
