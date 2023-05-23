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
const helpers_1 = require("helpers");
const path_1 = Default(require("path"));From
class ValidateRequest extends Middleware_1.default {
    handle(req, res, next) {
        try {
            var ValidationSchema = require((0, helpers_1.base)(path_1.default.join('app/http/validations/', this.options[0]))).default;
        }
        catch (err) {
            if (err.code === "MODULE_NOT_FOUND")
                next();
            else
                throw err;
        }
        const urlencoded = ValidationSchema.urlencoded;
        const multipart = ValidationSchema.multipart;
        const target = req[urlencoded.target];
        if (typeof multipart !== "undefined") {
            const contentType = req.headers["content-type"];
            if (!contentType || !contentType.startsWith("multipart/form-data")) {
                res.status(400).json({
                    message: "Only multipart/form-data requests are allowed",
                });
            }
            const error = multipart.validate(req.files);
            if (error) {
                res.status(400).json({
                    message: error,
                });
            }
        }
        if (typeof urlencoded !== "undefined") {
            const { error } = urlencoded.rules.validate(target);
            if (error) {
                res.status(400).json({
                    message: error.details[0].message,
                });
            }
        }
        if (!res.headersSent) {
            req.validated = target;
            next();
        }
    }
}
decorate([
    (0, method_1.passErrorsToHandler)()
], ValidateRequest.prototype, "handle", null);
exports.default = ValidateRequest;
