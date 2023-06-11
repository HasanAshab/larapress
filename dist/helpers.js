"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParams = exports.getModels = exports.checkProperties = exports.getVersion = exports.log = exports.setEnv = exports.controller = exports.middleware = exports.storage = exports.capitalizeFirstLetter = exports.base = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const middlewares_1 = __importDefault(require("register/middlewares"));
function base(basePath = "") {
    return path_1.default.join(__dirname, basePath);
}
exports.base = base;
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function storage(storage_path = "") {
    return path_1.default.resolve(path_1.default.join("storage", storage_path));
}
exports.storage = storage;
function middleware(keys, version) {
    var _a, _b;
    function getMiddleware(middlewarePath, options = []) {
        const fullPath = middlewarePath.startsWith("<global>")
            ? middlewarePath.replace("<global>", "illuminate/middlewares/global")
            : `app/http/${version !== null && version !== void 0 ? version : getVersion()}/middlewares/${middlewarePath}`;
        const MiddlewareClass = require(path_1.default.resolve(fullPath)).default;
        const middlewareInstance = new MiddlewareClass(options);
        const handler = middlewareInstance.handle.bind(middlewareInstance);
        return handler;
    }
    if (Array.isArray(keys)) {
        const middlewares = [];
        for (const key of keys) {
            const [name, params] = key.split(":");
            const middlewarePaths = middlewares_1.default[name];
            if (Array.isArray(middlewarePaths)) {
                const funcBasedParams = params === null || params === void 0 ? void 0 : params.split("|");
                for (let i = 0; i < middlewarePaths.length; i++) {
                    const middleware = getMiddleware(middlewarePaths[i], (_a = funcBasedParams === null || funcBasedParams === void 0 ? void 0 : funcBasedParams[i]) === null || _a === void 0 ? void 0 : _a.split(","));
                    middlewares.push(middleware);
                }
            }
            else {
                const middleware = getMiddleware(middlewarePaths, params === null || params === void 0 ? void 0 : params.split(","));
                middlewares.push(middleware);
            }
        }
        return middlewares;
    }
    const [name, params] = keys.split(":");
    const middlewarePaths = middlewares_1.default[name];
    if (middlewarePaths instanceof Array) {
        const middlewares = [];
        const funcBasedParams = typeof params !== "undefined"
            ? params.split("|") : undefined;
        for (let i = 0; i < middlewarePaths.length; i++) {
            const middleware = getMiddleware(middlewarePaths[i], (_b = funcBasedParams === null || funcBasedParams === void 0 ? void 0 : funcBasedParams[i]) === null || _b === void 0 ? void 0 : _b.split(","));
            middlewares.push(middleware);
        }
        return middlewares;
    }
    return getMiddleware(middlewarePaths, params === null || params === void 0 ? void 0 : params.split(","));
}
exports.middleware = middleware;
function controller(name, version) {
    version = version !== null && version !== void 0 ? version : getVersion();
    const controllerPath = path_1.default.resolve(path_1.default.join(`app/http/${version}/controllers`, name));
    const controllerClass = require(controllerPath).default;
    const controllerInstance = new controllerClass;
    const controllerPrefix = controllerClass.name.replace("Controller", "");
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance)).filter(name => name !== "constructor" && typeof controllerInstance[name] === 'function');
    const handlerAndValidatorStack = {};
    for (const methodName of methodNames) {
        const validationSubPath = `${controllerPrefix}/${capitalizeFirstLetter(methodName)}`;
        handlerAndValidatorStack[methodName] = [
            middleware(`validate:${version},${validationSubPath}`),
            controllerInstance[methodName]
        ];
    }
    return handlerAndValidatorStack;
}
exports.controller = controller;
function setEnv(envValues) {
    const envConfig = dotenv_1.default.parse(fs_1.default.readFileSync(".env"));
    for (const [key, value] of Object.entries(envValues)) {
        envConfig[key] = value;
    }
    try {
        fs_1.default.writeFileSync(".env", Object.entries(envConfig).map(([k, v]) => `${k}=${v}`).join("\n"));
        return true;
    }
    catch (err) {
        throw err;
    }
}
exports.setEnv = setEnv;
function log(data) {
    const path = "./storage/error.log";
    if (typeof data === "object") {
        data = JSON.stringify(data);
    }
    fs_1.default.appendFile(path, `${data}\n\n\n`, (err) => {
        if (err) {
            throw err;
        }
    });
}
exports.log = log;
function getVersion(path) {
    let target;
    if (typeof path === "undefined") {
        const error = new Error();
        const stackTrace = error.stack;
        if (!stackTrace)
            throw new Error("Failed to auto infer version. try to pass target path!");
        target = stackTrace;
    }
    else
        target = path;
    const regex = /\/(v\d+)\//;
    const match = target.match(regex);
    if (!match)
        throw new Error('This path is not a nested versional path!');
    return match[1];
}
exports.getVersion = getVersion;
function checkProperties(obj, properties) {
    for (const [name, type] of Object.entries(properties)) {
        if (!(name in obj && typeof obj[name] === type)) {
            return false;
        }
    }
    return true;
}
exports.checkProperties = checkProperties;
async function getModels() {
    const models = [];
    const modelNames = await fs_1.default.promises.readdir(base("app/models"));
    for (const modelName of modelNames) {
        const Model = require(base(`app/models/${modelName}`)).default;
        models.push(Model);
    }
    return models;
}
exports.getModels = getModels;
function getParams(func) {
    let str = func.toString();
    str = str.replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/(.)*/g, "")
        .replace(/{[\s\S]*}/, "")
        .replace(/=>/g, "")
        .trim();
    const start = str.indexOf("(") + 1;
    const end = str.length - 1;
    const result = str.substring(start, end).split(", ");
    const params = [];
    result.forEach(element => {
        element = element.replace(/=[\s\S]*/g, "").trim();
        if (element.length > 0)
            params.push(element);
    });
    return params;
}
exports.getParams = getParams;
