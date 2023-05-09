"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const Middleware = require(base("illuminate/middlewares/Middleware"));
const helpers_1 = require("helpers");
class WrapResponse {
    handle(req, res, next) {
        const originalJson = res.json;
        res.json = function (response) {
            const { data, message } = response;
            const success = res.statusCode >= 200 && res.statusCode < 300;
            const wrappedData = { success };
            if ((0, helpers_1.isObject)(response)) {
                wrappedData.data = {};
                for (const [key, value] of Object.entries(response)) {
                    if (["data", "message"].includes(key)) {
                        wrappedData[key] = value;
                    }
                    else {
                        if (key === "data") {
                            wrappedData.data = value;
                        }
                        else {
                            wrappedData.data[key] = value;
                        }
                    }
                }
            }
            else {
                wrappedData.data = response;
            }
            return originalJson.call(res, wrappedData);
        };
        next();
    }
}
exports.default = WrapResponse;
