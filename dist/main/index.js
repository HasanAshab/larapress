"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("main/app"));
const Setup_1 = __importDefault(require("main/Setup"));
const DB_1 = __importDefault(require("illuminate/utils/DB"));
const port = Number(process.env.APP_PORT) || 8000;
const connectToDB = process.env.DB_CONNECT || "true";
const nodeEnv = process.env.NODE_ENV;
// Connecting to database
if (connectToDB === "true") {
    console.log("Connecting to database...");
    DB_1.default.connect()
        .then(() => {
        console.log("done!");
    })
        .catch((err) => {
        console.log(err);
    });
}
// Registering all Cron Jobs
Setup_1.default.cronJobs();
// Listening for clients
const server = app_1.default.listen(port, () => {
    console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});
if (nodeEnv !== "production") {
    server.on("connection", (socket) => {
        const now = new Date();
        const time = now.toLocaleTimeString("en-US", {
            hour12: true
        });
        console.log(`*New connection: [${time}]`);
    });
}
const helpers_1 = require("helpers");
const utils_1 = require("illuminate/utils");
function getEndpoints() {
    const routeURLs = [];
    const routesBasePath = (0, helpers_1.base)("routes");
    const baseEndpoints = (0, utils_1.generateEndpointsFromDirTree)(routesBasePath);
    /*
    const apiBasePath = base("routes/api");
    const versions = fs.readdirSync(apiBasePath)
    for (const version of versions){
      const routerPath = path.join(apiBasePath, version);
      const routersName = fs.readdirSync(routerPath);
      for(const routerName of routersName){
        const router = require(path.join(routerPath, routerName)).default;
        */
    for (const [baseEndpoint, routerPath] of Object.entries(baseEndpoints)) {
        const router = require(routerPath).default;
        router.stack.forEach((middleware) => {
            if (middleware.route) {
                routeURLs.push(`${Object.keys(middleware.route.methods)} - ${baseEndpoint}${middleware.route.path}`);
            }
            else if (middleware.name === 'router') {
                middleware.handle.stack.forEach((handler) => {
                    const route = handler.route;
                    routeURLs.push(`${Object.keys(route.methods)} - ${route.path}`);
                });
            }
        });
    }
    return routeURLs;
}
// Print all route URLs
console.log(getEndpoints());
