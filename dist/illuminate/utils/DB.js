"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class DB {
    static async connect(options = this.defaultConnectOptions) {
        await mongoose_1.default.connect(this.url, options);
    }
    static async disconnect() {
        await mongoose_1.default.disconnect();
    }
    static reset() {
        const collections = mongoose_1.default.connection.collections;
        const dropPromises = [];
        for (const name in collections) {
            const dropPromise = new Promise((resolve, reject) => {
                collections[name].drop((err) => {
                    if (err && err.code !== 26) {
                        reject(err);
                    }
                    else
                        resolve();
                });
            });
            dropPromises.push(dropPromise);
        }
        return Promise.all(dropPromises);
    }
}
DB.url = (_a = process.env.DB_URL) !== null && _a !== void 0 ? _a : "mongodb://127.0.0.1:27017/test";
DB.defaultConnectOptions = {
    maxPoolSize: (_b = Number(process.env.DB_MAX_POOL_SIZE)) !== null && _b !== void 0 ? _b : 5
};
exports.default = DB;
