"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
process.env.NODE_ENV === "production" && require('module-alias/register');
const config_1 = __importDefault(require("config"));
const app_1 = __importDefault(require("~/main/app"));
const Setup_1 = __importDefault(require("~/main/Setup"));
const log = process.env.NODE_ENV === "development";
process.env.NODE_ENV === "production" && Setup_1.default.cachedConfig();
// Connect to database
if (config_1.default.get("db.connect")) {
    log && console.log("Connecting to database...");
    // DB.connect().then(Setup.mongooseModels);
    log && console.log("DB connected!");
}
// Registering Cron Jobs
Setup_1.default.cronJobs();
const port = config_1.default.get("app.port");
const server = app_1.default.listen(port, () => {
    process.env.NODE_ENV !== "test" && console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});
log && server.on("connection", (socket) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
        hour12: true
    });
    console.log(`*New connection: [${time}]`);
});
const Config_1 = __importDefault(require("Config"));
Config_1.default.parse({ saveChanges: true }).then(() => {
    console.log(Config_1.default.get());
    console.log(Config_1.default.set("app.name", "lara"));
    console.log(Config_1.default.get());
});
exports.default = server;
