"use strict";
var importDefault = (this && this.importDefault) || function (mod) {
    return (mod && mod.esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "esModule", { value: true });
const Middleware_1 = importDefault(require("illuminate/middlewares/Middleware"));
const express_rate_limit_1 = importDefault(require("express-rate-limit"));
class LimitRequestRate extends Middleware_1.default {
    constructor() {
        super(...arguments);
        this.handle = (0, express_rate_limit_1.default)({
            windowMs: 60 * 1000,
            max: Number(this.options[0]),
        });
    }
}
exports.default = LimitRequestRate;
