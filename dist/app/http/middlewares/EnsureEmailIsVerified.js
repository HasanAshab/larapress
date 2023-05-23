"use strict";
var decorate = (this && this.decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var importDefault = (this && this.importDefault) || function (mod) {
    return (mod && mod.esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "esModule", { value: true });
const Middleware_1 = importDefault(require("illuminate/middlewares/Middleware"));
const method_1 = require("illuminate/decorators/method");
class EnsureEmailIsVerified extends Middleware_1.default {
    handle(req, res, next) {
        var _a;
        if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.emailVerified) {
            return next();
        }
        res.status(401).json({
            message: "Your have to verify your email to perfom this action!",
        });
    }
}
decorate([
    (0, method_1.passErrorsToHandler)()
], EnsureEmailIsVerified.prototype, "handle", null);
exports.default = EnsureEmailIsVerified;
