"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Middleware_1 = __importDefault(require("illuminate/middlewares/Middleware"));
class EnsureEmailIsVerified extends Middleware_1.default {
    handle(req, res, next) {
        var _a;
        if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.emailVerified) {
            return next();
        }
        return res.status(401).json({
            message: "Your have to verify your email to perfom this action!",
        });
    }
}
exports.default = EnsureEmailIsVerified;
