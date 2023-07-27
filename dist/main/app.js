"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_handlebars_1 = require("express-handlebars");
const Setup_1 = __importDefault(require("main/Setup"));
const app = (0, express_1.default)();
// Securing Application From Potential Attacks
app.use((0, cors_1.default)({
    // Domains that can only access the API
    origin: ["http://localhost:3000"]
}));
app.use((0, helmet_1.default)());
app.use("*", (0, helpers_1.middleware)("maintenance.check", ["limit", { time: 60 * 1000, count: 60 }]));
if (process.env.TRACE_PERFORMANCE === "true")
    app.use((0, helpers_1.middleware)("performance.trace"));
// Setting middlewares for request parsing 
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, express_fileupload_1.default)());
// Registering Handlebars template engine
app.engine("handlebars", (0, express_handlebars_1.engine)());
app.set("view engine", "handlebars");
app.set("views", (0, helpers_1.base)("views"));
// Registering mongoose global plugins
Setup_1.default.mongooseGlobalPlugins();
// Registering global middlewares
app.use((0, helpers_1.middleware)("helpers.inject"));
// Registering all event and listeners
Setup_1.default.events(app);
// Registering all group routes 
Setup_1.default.routes(app);
// Serving static folder
app.use("/static", express_1.default.static((0, helpers_1.base)("storage/public/static")));
// Registering global error handling middleware
app.use((0, helpers_1.middleware)("error.handle"));
Setup_1.default.routes(app);
exports.default = app;
