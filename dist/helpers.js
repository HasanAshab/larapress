"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModels = exports.customError = exports.checkProperties = exports.getVersion = exports.log = exports.setEnv = exports.controller = exports.middleware = exports.storage = exports.capitalizeFirstLetter = exports.base = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const middlewares_1 = __importDefault(require("register/middlewares"));
const errors_1 = __importDefault(require("register/errors"));
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
function middleware(...keysWithConfig) {
    function wrapMiddleware(context, handler) {
        return async (req, res, next) => {
            try {
                return await handler.apply(context, [req, res, next]);
            }
            catch (err) {
                next(err);
            }
        };
    }
    function getMiddleware(middlewareKey, config) {
        var _a, _b;
        const middlewarePaths = middlewares_1.default[middlewareKey];
        const handlers = [];
        if (typeof middlewarePaths === "string") {
            const fullPath = middlewarePaths.startsWith("<global>")
                ? middlewarePaths.replace("<global>", "illuminate/middlewares/global") : `app/http/${(_a = config === null || config === void 0 ? void 0 : config.version) !== null && _a !== void 0 ? _a : getVersion()}/middlewares/${middlewarePaths}`;
            const MiddlewareClass = require(path_1.default.resolve(fullPath)).default;
            const middlewareInstance = new MiddlewareClass(config);
            const handler = middlewareInstance.handle.length === 4 ? middlewareInstance.handle.bind(middlewareInstance) : wrapMiddleware(middlewareInstance, middlewareInstance.handle);
            handlers.push(handler);
        }
        else {
            for (const middlewarePath of middlewarePaths) {
                const fullPath = middlewarePath.startsWith("<global>")
                    ? middlewarePath.replace("<global>", "illuminate/middlewares/global") : `app/http/${(_b = config === null || config === void 0 ? void 0 : config.version) !== null && _b !== void 0 ? _b : getVersion()}/middlewares/${middlewarePath}`;
                const MiddlewareClass = require(path_1.default.resolve(fullPath)).default;
                const middlewareInstance = new MiddlewareClass(config);
                const handler = middlewareInstance.handle.length === 4 ? middlewareInstance.handle.bind(middlewareInstance) : wrapMiddleware(middlewareInstance, middlewareInstance.handle);
                handlers.push(handler);
            }
        }
        return handlers;
    }
    let middlewares = [];
    for (const keyWithConfig of keysWithConfig) {
        if (typeof keyWithConfig === "string") {
            middlewares = [...middlewares,
                ...getMiddleware(keyWithConfig)];
        }
        else {
            const [key, config] = keyWithConfig;
            const middleware = getMiddleware(key, config);
            middlewares = [...middlewares,
                ...middleware];
        }
    }
    return middlewares;
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
        const requestHandler = async function (req, res, next) {
            try {
                const handler = controllerInstance[methodName];
                if (handler.length === 2)
                    await handler(req, res);
                else if (handler.length === 1 || handler.length === 0) {
                    const response = await handler(req);
                    res.api(response);
                }
                else
                    throw new Error(`Unknown param on ${controllerClass.name}:${methodName}`);
            }
            catch (err) {
                next(err);
            }
        };
        const validationSubPath = `${controllerPrefix}/${capitalizeFirstLetter(methodName)}`;
        handlerAndValidatorStack[methodName] = [
            ...middleware(["validate", {
                    version, validationSubPath
                }]),
            requestHandler
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
    if (data instanceof Error) {
        data = data.stack;
    }
    if (process.env.NODE_ENV)
        console.log(data);
    fs_1.default.appendFile(path, `${new Date}:\n${data.toString()}\n\n\n`, (err) => {
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
function customError(type, data) {
    const errorData = errors_1.default[type];
    const error = new Error();
    //error.name = this.name;
    error.type = type;
    error.status = errorData.status;
    error.message = errorData.message;
    if (typeof data !== "undefined") {
        error.message = error.message.replace(/:(\w+)/g, (match, key) => {
            if (typeof data[key] === "undefined")
                throw new Error(`The "${key}" key is required in "data" argument.`);
            return data[key];
        });
    }
    return error;
}
exports.customError = customError;
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
