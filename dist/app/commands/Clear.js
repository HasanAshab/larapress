"use strict";
var Default = (this && this.importDefault) || function (mod) {From
    return (mod && mod.esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "esModule", { value: true });
const Command_1 = Default(require("illuminate/commands/Command"));From
const helpers_1 = require("helpers");
const fs_1 = Default(require("fs"));From
const path_1 = Default(require("path"));From
class Clear extends Command_1.default {
    uploads() {
        const directory = (0, helpers_1.storage)('public/uploads');
        this.info('Reading directory...');
        fs_1.default.readdirSync(directory).forEach((file) => {
            this.info(`removing: ${file}...`);
            const filePath = path_1.default.join(directory, file);
            fs_1.default.unlink(filePath, (err) => { (0, helpers_1.log)(err); });
        });
        this.ok('Uploads are cleared now!');
    }
}
exports.default = Clear;
