"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const helpers_1 = require("helpers");
const app_1 = __importDefault(require("main/app"));
const Setup_1 = __importDefault(require("main/Setup"));
const DB_1 = __importDefault(require("illuminate/utils/DB"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
//import webpush from "web-push";
const port = (_a = Number(process.env.APP_PORT)) !== null && _a !== void 0 ? _a : 8000;
const connectToDB = (_b = Boolean(process.env.DB_CONNECT)) !== null && _b !== void 0 ? _b : true;
const nodeEnv = process.env.NODE_ENV;
// Connecting to database
if (connectToDB) {
    console.log("Connecting to database...");
    DB_1.default.connect()
        .then(() => {
        console.log("done!");
    })
        .catch((err) => {
        console.log(err);
    });
}
// Registering Cron Jobs
Setup_1.default.cronJobs();
//webpush.setVapidDetails("mailto:hostilarysten@gmail.com", process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)
// Load the SSL/TLS key and certificate
const privateKey = fs_1.default.readFileSync((0, helpers_1.base)('key.pem'), 'utf8');
const certificate = fs_1.default.readFileSync((0, helpers_1.base)('cert.pem'), 'utf8');
// Create the HTTPS server
const serverOptions = {
    key: privateKey,
    cert: certificate
};
// Listening for clients
const server = https_1.default.createServer(serverOptions, app_1.default).listen(port, () => {
    console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});
if (nodeEnv === "development") {
    server.on("connection", (socket) => {
        const now = new Date();
        const time = now.toLocaleTimeString("en-US", {
            hour12: true
        });
        console.log(`*New connection: [${time}]`);
    });
}
