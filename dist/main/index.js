"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "loadTest")
    && require('module-alias/register');
const config_1 = __importDefault(require("config"));
const app_1 = __importDefault(require("~/main/app"));
const Setup_1 = __importDefault(require("~/main/Setup"));
//import Config from "Config";
const DB_1 = __importDefault(require("DB"));
const Mail_1 = __importDefault(require("Mail"));
process.env.NODE_ENV === "loadTest" && Mail_1.default.mock();
const log = process.env.NODE_ENV === "development";
process.env.NODE_ENV === "production" && Setup_1.default.cachedConfig();
/*
Config.parse({ caching: "redis", redisUrl: "redis://default:raAjgzb9ceMv8MVUFzSl7cY6DFJC3MR1@redis-12100.c305.ap-south-1-1.ec2.cloud.redislabs.com:12100" }).then(async () => {
  console.log(Config.get())
  await Config.set({
    app: {
      name: "Blalalal"
    }
  })
  console.log(Config.get())

});
*/
// Connect to database
if (config_1.default.get("db.connect")) {
    log && console.log("Connecting to database...");
    DB_1.default.connect().then(() => {
        log && console.log("DB connected!");
        Setup_1.default.mongooseModels();
    });
}
// Registering Cron Jobs
Setup_1.default.cronJobs();
let server;
const loadBalancerConfig = config_1.default.get("loadBalancer");
if (loadBalancerConfig.enabled) {
    console.log("Server running on:");
    for (const port of loadBalancerConfig.ports) {
        app_1.default.listen(port, () => {
            console.log(`[http://127.0.0.1:${port}]`);
        }).on("connection", (socket) => {
            const time = new Date().toLocaleTimeString("en-US", { hour12: true });
            log && console.log(`*New connection on port ${port} [${time}]`);
        });
    }
}
else {
    const port = config_1.default.get("app.port");
    server = app_1.default.listen(port, () => {
        process.env.NODE_ENV !== "test" && console.log(`Server running on [http://127.0.0.1:${port}] ...`);
    });
    log && server.on("connection", (socket) => {
        const time = new Date().toLocaleTimeString("en-US", { hour12: true });
        console.log(`*New connection: [${time}]`);
    });
}
exports.default = server;
