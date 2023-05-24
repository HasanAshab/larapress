"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("illuminate/commands/Command"));
const helpers_1 = require("helpers");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Clear extends Command_1.default {
    uploads() {
        const directory = (0, helpers_1.storage)("public/uploads");
        this.info("Reading directory...");
        fs_1.default.readdirSync(directory).forEach((file) => {
            this.info(`removing: ${file}...`);
            const filePath = path_1.default.join(directory, file);
            fs_1.default.unlink(filePath, (err) => { (0, helpers_1.log)(err); });
        });
        this.success("Uploads are cleared now!");
    }
}
exports.default = Clear;
