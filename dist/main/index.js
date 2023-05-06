"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../helpers"));
for (const [name, helper] of Object.entries(helpers_1.default)) {
    globalThis[name] = helper;
}
const app_1 = __importDefault(require("main/app"));
console.log(app_1.default);
/*
const register = require(base("main/register"));
const DB = require(base("illuminate/utils/DB"));
const port = Number(process.env.PORT) || 8000;
const connectToDB = process.env.DB_CONNECT || "true";
const nodeEnv = process.env.NODE_ENV;

// Connecting to database
if (connectToDB === "true") {
  console.log("Connecting to database...");
  DB.connect()
    .then(() => {
      console.log("done!");
    })
    .catch((err) => {
      console.log(err);
    });
}

// Registering all Cron Jobs
register.registerCronJobs();

// Listening for clients
const server = app.listen(port, () => {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

if (nodeEnv !== "production") {
  server.on("connection", (socket) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour12: true });
    console.log(`*New connection: [${time}]`);
  });
}

*/ 
