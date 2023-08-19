"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_hidden_1 = __importDefault(require("mongoose-hidden"));
const helpers_1 = require("helpers");
const node_cron_1 = __importDefault(require("node-cron"));
const Artisan_1 = __importDefault(require("illuminate/utils/Artisan"));
const Cache_1 = __importDefault(require("illuminate/utils/Cache"));
const events_1 = __importDefault(require("register/events"));
const cron_1 = __importDefault(require("register/cron"));
class Setup {
    static async cachedConfig() {
        const customConfig = await Cache_1.default.driver("redis").get("config");
        customConfig && Object.assign(config_1.default, customConfig);
    }
    static cronJobs() {
        for (const [schedule, commands] of Object.entries(cron_1.default)) {
            if (Array.isArray(commands)) {
                for (const command of commands) {
                    const [commandName, ...args] = command.split(" ");
                    node_cron_1.default.schedule(schedule, (async () => await Artisan_1.default.call(commandName, args, false)));
                }
            }
            else {
                const [commandName, ...args] = commands.split(" ");
                node_cron_1.default.schedule(schedule, (async () => await Artisan_1.default.call(commandName, args, false)));
            }
        }
    }
    ;
    static events(app) {
        for (const [event, listenerNames] of Object.entries(events_1.default)) {
            for (const listenerName of listenerNames) {
                const Listener = require((0, helpers_1.base)(`app/listeners/${listenerName}`)).default;
                const listenerInstance = new Listener();
                app.on(event, listenerInstance.dispatch.bind(listenerInstance));
            }
        }
    }
    ;
    static routes(app) {
        const routesRootPath = (0, helpers_1.base)("routes");
        const routesEndpointPaths = (0, helpers_1.generateEndpointsFromDirTree)(routesRootPath);
        for (const [endpoint, path] of Object.entries(routesEndpointPaths)) {
            app.use(endpoint, require(path).default);
        }
    }
    ;
    static mongooseModels() {
        const modelsBaseDir = (0, helpers_1.base)("app/models");
        const modelsName = fs_1.default.readdirSync(modelsBaseDir);
        for (const modelName of modelsName) {
            require(modelsBaseDir + "/" + modelName);
        }
    }
    static mongooseGlobalPlugins() {
        const globalPluginsBaseDir = (0, helpers_1.base)("illuminate/plugins/global");
        const globalPluginsName = fs_1.default.readdirSync(globalPluginsBaseDir);
        for (const globalPluginName of globalPluginsName) {
            const plugin = require(globalPluginsBaseDir + "/" + globalPluginName).default;
            mongoose_1.default.plugin(plugin);
        }
        mongoose_1.default.plugin((0, mongoose_hidden_1.default)(), { hidden: { _id: false } });
    }
}
exports.default = Setup;
