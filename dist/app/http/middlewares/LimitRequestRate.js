"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Middleware_1 = __importDefault(require("illuminate/middlewares/Middleware"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
class LimitRequestRate extends Middleware_1.default {
    constructor() {
        super(...arguments);
        this.handle = (0, express_rate_limit_1.default)({
            windowMs: 60 * 1000,
            max: this.options[0],
        });
    }
}
exports.default = LimitRequestRate;
