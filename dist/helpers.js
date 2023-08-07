"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEndpointsFromDirTree = exports.loadDir = exports.getModels = exports.customError = exports.checkProperties = exports.getVersion = exports.log = exports.env = exports.controller = exports.middleware = exports.storage = exports.toSnakeCase = exports.toCamelCase = exports.capitalizeFirstLetter = exports.base = void 0;
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
function toCamelCase(str) {
    return str.replace(/_./g, (match) => match.charAt(1).toUpperCase());
}
exports.toCamelCase = toCamelCase;
function toSnakeCase(str) {
    return str.replace(/([A-Z])/g, '_$1');
}
exports.toSnakeCase = toSnakeCase;
function storage(storage_path = "") {
    return path_1.default.join(__dirname, "storage", storage_path);
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
        var _a;
        const middlewarePath = middlewares_1.default[middlewareKey];
        const fullPath = middlewarePath.startsWith("<global>")
            ? middlewarePath.replace("<global>", "illuminate/middlewares/global")
            : `app/http/${(_a = config === null || config === void 0 ? void 0 : config.version) !== null && _a !== void 0 ? _a : "v1"}/middlewares/${middlewarePath}`;
        const MiddlewareClass = require(path_1.default.resolve(fullPath)).default;
        const middlewareInstance = new MiddlewareClass(config);
        const handler = middlewareInstance.handle.length === 4 ? middlewareInstance.handle.bind(middlewareInstance) : wrapMiddleware(middlewareInstance, middlewareInstance.handle);
        return handler;
    }
    let middlewares = [];
    for (const keyWithConfig of keysWithConfig) {
        if (typeof keyWithConfig === "string") {
            middlewares.push(getMiddleware(keyWithConfig));
        }
        else {
            middlewares.push(getMiddleware(keyWithConfig[0], keyWithConfig[1]));
        }
    }
    return middlewares;
}
exports.middleware = middleware;
function controller(name, version = getVersion()) {
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
                    const { status = 200 } = response;
                    delete response.status;
                    res.status(status).api(response);
                }
                else
                    throw new Error(`Unknown param on ${name}:${methodName}`);
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
function env(envValues) {
    const envConfig = dotenv_1.default.parse(fs_1.default.readFileSync(".env"));
    if (!envValues)
        return envConfig;
    for (const key in envValues) {
        process.env[key] = envValues[key];
        envConfig[key] = envValues[key];
    }
    try {
        fs_1.default.writeFileSync(".env", Object.entries(envConfig).map(([k, v]) => `${k}=${v}`).join("\n"));
    }
    catch (err) {
        throw err;
    }
    return envConfig;
}
exports.env = env;
function log(data) {
    if (process.env.LOG === "file") {
        const path = "./storage/logs/error.log";
        if (data instanceof Error) {
            data = data.stack;
        }
        fs_1.default.appendFile(path, `${new Date()}:\n${data.toString()}\n\n\n`, (err) => {
            if (err)
                throw err;
        });
    }
    else if (process.env.LOG === "console") {
        console.log(data);
    }
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
function loadDir(dirPath) {
    const directories = dirPath.split(path_1.default.sep);
    let currentPath = "";
    for (const dir of directories) {
        currentPath = path_1.default.join(currentPath, dir);
        const fullPath = path_1.default.join(__dirname, currentPath);
        if (!fs_1.default.existsSync(currentPath)) {
            fs_1.default.mkdirSync(currentPath);
        }
    }
}
exports.loadDir = loadDir;
function generateEndpointsFromDirTree(rootPath) {
    const endpointPathPair = {};
    const stack = [rootPath];
    while (stack.length > 0) {
        const currentPath = stack.pop();
        if (!currentPath) {
            break;
        }
        const items = fs_1.default.readdirSync(currentPath);
        for (const item of items) {
            const itemPath = path_1.default.join(currentPath, item);
            const status = fs_1.default.statSync(itemPath);
            if (status.isFile()) {
                const itemPathEndpoint = itemPath
                    .replace(rootPath, "")
                    .split(".")[0]
                    .toLowerCase()
                    .replace(/index$/, "");
                endpointPathPair[itemPathEndpoint] = itemPath;
            }
            else if (status.isDirectory()) {
                stack.push(itemPath);
            }
        }
    }
    return endpointPathPair;
}
exports.generateEndpointsFromDirTree = generateEndpointsFromDirTree;
