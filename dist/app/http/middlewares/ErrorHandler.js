"use strict";
var Default = (this && this.importDefault) || function (mod) {From
    return (mod && mod.esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "esModule", { value: true });
const Middleware_1 = Default(require("illuminate/middlewares/Middleware"));From
const helpers_1 = require("helpers");
class ErrorHandler extends Middleware_1.default {
    handle(err, req, res, next) {
        const status = err.statusCode || err.status || 500;
        const message = err.message || 'Internal server error!';
        if (status === 500) {
            (0, helpers_1.log)(`${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
            if (process.env.NODE_ENV === 'production')
                res.status(status).json({ message: 'Internal server error!' });
            else
                res.status(status).json({ message: err.stack });
        }
        else
            res.status(status).json({ message });
    }
    ;
}
exports.default = ErrorHandler;
