"use strict";
var Default = (this && this.importDefault) || function (mod) {From
    return (mod && mod.esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "esModule", { value: true });
const mongoose_1 = Default(require("mongoose"));From
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
