"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
class DB {
    static async connect(options = this.defaultConnectOptions) {
        await mongoose_1.default.connect(config_1.default.get("db.url"), options);
    }
    static async disconnect() {
        await mongoose_1.default.disconnect();
    }
    static reset() {
        const collections = mongoose_1.default.connection.collections;
        const dropPromises = [];
        for (const name in collections) {
            const dropPromise = collections[name].drop();
            dropPromises.push(dropPromise);
        }
        return Promise.all(dropPromises);
    }
}
DB.defaultConnectOptions = {
    maxPoolSize: config_1.default.get("db.maxPoolSize")
};
exports.default = DB;
