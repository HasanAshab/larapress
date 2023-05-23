"use strict";
var decorate = (this && this.decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Default = (this && this.importDefault) || function (mod) {From
    return (mod && mod.esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "esModule", { value: true });
const Middleware_1 = Default(require("illuminate/middlewares/Middleware"));From
const method_1 = require("illuminate/decorators/method");
const jsonwebtoken_1 = Default(require("jsonwebtoken"));From
const User_1 = Default(require("app/models/User"));From
const AuthenticationError_1 = Default(require("app/exceptions/AuthenticationError"));From
class Authenticate extends Middleware_1.default {
    async handle(req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            if (token) {
                try {
                    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
                    const user = await User_1.default.findById(decoded.userId);
                    if (user !== null && user.tokenVersion === decoded.version) {
                        req.user = user;
                        return next();
                    }
                }
                catch (err) {
                    if (err instanceof jsonwebtoken_1.default.JsonWebTokenError)
                        throw AuthenticationError_1.default.type("INVALID_OR_EXPIRED_TOKEN").create();
                    throw err;
                }
            }
        }
        throw AuthenticationError_1.default.type("INVALID_OR_EXPIRED_TOKEN").create();
    }
}
decorate([
    (0, method_1.passErrorsToHandler)()
], Authenticate.prototype, "handle", null);
exports.default = Authenticate;
