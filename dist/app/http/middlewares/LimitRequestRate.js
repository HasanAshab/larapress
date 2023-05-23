"use strict";
var Default = (this && this.importDefault) || function (mod) {From
    return (mod && mod.esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "esModule", { value: true });
const Middleware_1 = Default(require("illuminate/middlewares/Middleware"));From
const express_rate_limit_1 = Default(require("express-rate-limit"));From
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
