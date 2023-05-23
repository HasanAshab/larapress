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
const guards_1 = require("illuminate/guards");
class WrapResponse extends Middleware_1.default {
    async handle(req, res, next) {
        const originalJson = res.json;
        res.json = function (response) {
            if (res.headersSent) {
                return res;
            }
            const success = res.statusCode >= 200 && res.statusCode < 300;
            const wrappedData = {
                success
            };
            if ((0, guards_1.isObject)(response)) {
                wrappedData.data = {};
                for (const [key, value] of Object.entries(response)) {
                    if (key === "data") {
                        wrappedData.data = value;
                    }
                    else if (key === "message") {
                        wrappedData.message = value;
                    }
                    else {
                        if (key === "data") {
                            wrappedData.data = value;
                        }
                        else {
                            const data = {};
                            data[key] = value;
                            wrappedData.data = Object.assign(Object.assign({}, wrappedData.data), { data });
                        }
                    }
                }
            }
            else if (Array.isArray(response)) {
                wrappedData.data = response;
            }
            return originalJson.call(res, wrappedData);
        };
        next();
    }
}
decorate([
    (0, method_1.passErrorsToHandler)()
], WrapResponse.prototype, "handle", null);
exports.default = WrapResponse;
