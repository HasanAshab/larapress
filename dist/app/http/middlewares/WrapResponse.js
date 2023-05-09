"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Middleware_1 = __importDefault(require("illuminate/middlewares/Middleware"));
const helpers_1 = require("helpers");
class WrapResponse extends Middleware_1.default {
    handle(req, res, next) {
        const originalJson = res.json;
        res.json = function (response) {
            const success = res.statusCode >= 200 && res.statusCode < 300;
            const wrappedData = { success };
            if ((0, helpers_1.isObject)(response)) {
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
exports.default = WrapResponse;
