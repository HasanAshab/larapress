"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("main/app"));
const Setup_1 = __importDefault(require("main/Setup"));
const DB_1 = __importDefault(require("illuminate/utils/DB"));
const port = (_a = Number(process.env.APP_PORT)) !== null && _a !== void 0 ? _a : 8000;
const connectToDB = (_b = Boolean(process.env.DB_CONNECT)) !== null && _b !== void 0 ? _b : true;
const nodeEnv = process.env.NODE_ENV;
// Connecting to database
if (connectToDB) {
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
/*
const serverOptions = {
  key: fs.readFileSync(base('main/certificates/key.pem'), 'utf8');
  cert: fs.readFileSync(base('main/certificates/cert.pem'), 'utf8');
}

// Listening for clients
const server = https.createServer(serverOptions, app).listen(port, () => {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});
*/
const server = app_1.default.listen(port, () => {
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
const config_1 = __importDefault(require("config"));
console.log(config_1.default.get("foo"));
