"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("illuminate/commands/Command"));
const Cache_1 = __importDefault(require("illuminate/utils/Cache"));
const cache_1 = __importDefault(require("register/cache"));
const child_process_1 = require("child_process");
class Clear extends Command_1.default {
    uploads() {
        (0, child_process_1.execSync)("rm -r storage/public/uploads");
        (0, child_process_1.execSync)("mkdir  storage/public/uploads");
        this.success("Uploads are cleared now!");
    }
    reports() {
        this.requiredParams(["name"]);
        const { name } = this.params;
        (0, child_process_1.execSync)("rm -r storage/reports/" + name);
        (0, child_process_1.execSync)("mkdir  storage/reports/" + name);
        this.success(name + " reports are clear now!");
    }
    async cache() {
        const { key, driver } = this.params;
        if (driver) {
            await Cache_1.default.driver(driver).clear(key);
        }
        else {
            const tasks = [];
            for (const driverName of cache_1.default.drivers) {
                const task = Cache_1.default.driver(driverName).clear(key);
                tasks.push(task);
            }
            await Promise.all(tasks);
        }
        this.success("Cache cleared successfully!");
    }
}
exports.default = Clear;
