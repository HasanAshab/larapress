"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = __importDefault(require("config"));
const app_1 = __importDefault(require("main/app"));
const Setup_1 = __importDefault(require("main/Setup"));
const DB_1 = __importDefault(require("illuminate/utils/DB"));
(async () => {
    process.env.NODE_ENV === "production" && await Setup_1.default.cachedConfig();
    // Connecting to database
    if (config_1.default.get("db.connect")) {
        console.log("Connecting to database...");
        DB_1.default.connect()
            .then(() => {
            console.log("DB connected!");
        })
            .catch((err) => {
            console.log(err);
        });
    }
    // Registering Mongoose Models
    Setup_1.default.mongooseModels();
    // Registering Cron Jobs
    Setup_1.default.cronJobs();
    const port = config_1.default.get("app.port");
    const server = app_1.default.listen(port, () => {
        console.log(`Server running on [http://127.0.0.1:${port}] ...`);
    });
    if (process.env.NODE_ENV === "development") {
        server.on("connection", (socket) => {
            const now = new Date();
            const time = now.toLocaleTimeString("en-US", {
                hour12: true
            });
            console.log(`*New connection: [${time}]`);
        });
    }
})();
