"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Middleware_1 = __importDefault(require("illuminate/middlewares/Middleware"));
const Cache_1 = __importDefault(require("illuminate/utils/Cache"));
class ValidateSignature extends Middleware_1.default {
    handle(req, res, next) {
        const port = req.app.get('port') || req.socket.localPort;
        const fullUrl = `${req.protocol}://${req.hostname}:${port}${req.baseUrl}${req.path}`;
        const signature = req.query.s;
        if (typeof signature !== 'undefined') {
            const signedSignature = Cache_1.default.get(`__signed__${fullUrl}`);
            if (signedSignature && signedSignature === signature) {
                return next();
            }
        }
        return res.status(401).json({
            message: 'Invalid signature!'
        });
    }
}
exports.default = ValidateSignature;
