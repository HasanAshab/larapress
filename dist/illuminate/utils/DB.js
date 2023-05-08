"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/test";
class DB {
    static async connect(url, options) {
        await mongoose_1.default.connect(url || dbUrl, options);
    }
    static async disconnect() {
        await mongoose_1.default.disconnect();
    }
}
exports.default = DB;
