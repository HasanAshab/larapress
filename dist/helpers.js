"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProperties = exports.getParams = exports.log = exports.setEnv = exports.middleware = exports.storage = exports.route = exports.clientUrl = exports.url = exports.capitalizeFirstLetter = exports.base = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const urls_1 = __importDefault(require("register/urls"));
const middlewares_1 = __importDefault(require("register/middlewares"));
function base(base_path = '') {
    return path_1.default.join(__dirname, base_path);
}
exports.base = base;
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function url(url_path = '') {
    const domain = process.env.APP_DOMAIN;
    const port = process.env.APP_PORT;
    const protocol = 'http';
    //const protocol = port === '443'? 'https' : 'http';
    return `${protocol}://${path_1.default.join(`${domain}:${port}`, url_path)}`;
}
exports.url = url;
function clientUrl(url_path = '') {
    const domain = process.env.CLIENT_DOMAIN;
    const port = process.env.CLIENT_PORT;
    const protocol = 'http';
    //const protocol = port === '443'? 'https' : 'http';
    return `${protocol}://${path_1.default.join(`${domain}:${port}`, url_path)}`;
}
exports.clientUrl = clientUrl;
function route(name, data) {
    var _a;
    let endpoint = urls_1.default[name];
    if (!endpoint) {
        throw new Error('Endpoint not found!');
    }
    if (data) {
        const regex = /:(\w+)/g;
        const params = endpoint.match(regex);
        if (params) {
            for (const param of params) {
                endpoint = endpoint.replace(param, (_a = data[param.slice(1)]) === null || _a === void 0 ? void 0 : _a.toString());
            }
        }
    }
    return `${process.env.APP_URL}${endpoint}`;
}
exports.route = route;
function storage(storage_path = '') {
    return path_1.default.join(__dirname, path_1.default.join('storage', storage_path));
}
exports.storage = storage;
function middleware(keys) {
    var _a, _b;
    function getMiddleware(middlewarePath, options = []) {
        const MiddlewareClass = require(path_1.default.join(__dirname, middlewarePath)).default;
        const middlewareInstance = new MiddlewareClass(options);
        return middlewareInstance.handle.bind(middlewareInstance);
    }
    if (Array.isArray(keys)) {
        const middlewares = [];
        for (const key of keys) {
            const [name, params] = key.split(':');
            const middlewarePaths = middlewares_1.default[name];
            if (Array.isArray(middlewarePaths)) {
                const funcBasedParams = params === null || params === void 0 ? void 0 : params.split('|');
                for (let i = 0; i < middlewarePaths.length; i++) {
                    const middleware = getMiddleware(middlewarePaths[i], (_a = funcBasedParams === null || funcBasedParams === void 0 ? void 0 : funcBasedParams[i]) === null || _a === void 0 ? void 0 : _a.split(','));
                    middlewares.push(middleware);
                }
            }
            else {
                const middleware = getMiddleware(middlewarePaths, params === null || params === void 0 ? void 0 : params.split(','));
                middlewares.push(middleware);
            }
        }
        return middlewares;
    }
    const [name, params] = keys.split(':');
    const middlewarePaths = middlewares_1.default[name];
    if (middlewarePaths instanceof Array) {
        const middlewares = [];
        const funcBasedParams = typeof params !== 'undefined'
            ? params.split('|') : undefined;
        for (let i = 0; i < middlewarePaths.length; i++) {
            const middleware = getMiddleware(middlewarePaths[i], (_b = funcBasedParams === null || funcBasedParams === void 0 ? void 0 : funcBasedParams[i]) === null || _b === void 0 ? void 0 : _b.split(','));
            middlewares.push(middleware);
        }
        return middlewares;
    }
    return getMiddleware(middlewarePaths, params === null || params === void 0 ? void 0 : params.split(','));
}
exports.middleware = middleware;
function setEnv(envValues) {
    const envConfig = dotenv_1.default.parse(fs_1.default.readFileSync('.env'));
    for (const [key, value] of Object.entries(envValues)) {
        envConfig[key] = value;
    }
    try {
        fs_1.default.writeFileSync('.env', Object.entries(envConfig).map(([k, v]) => `${k}=${v}`).join('\n'));
        return true;
    }
    catch (err) {
        throw err;
    }
}
exports.setEnv = setEnv;
function log(data) {
    const path = './storage/error.log';
    if (typeof data === 'object') {
        data = JSON.stringify(data);
    }
    fs_1.default.appendFile(path, `${data}\n\n\n`, (err) => {
        if (err) {
            throw err;
        }
    });
}
exports.log = log;
function getParams(func) {
    let str = func.toString();
    str = str.replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/(.)*/g, '')
        .replace(/{[\s\S]*}/, '')
        .replace(/=>/g, '')
        .trim();
    const start = str.indexOf("(") + 1;
    const end = str.length - 1;
    const result = str.substring(start, end).split(", ");
    const params = [];
    result.forEach(element => {
        element = element.replace(/=[\s\S]*/g, '').trim();
        if (element.length > 0)
            params.push(element);
    });
    return params;
}
exports.getParams = getParams;
function checkProperties(obj, properties) {
    for (const [name, type] of Object.entries(properties)) {
        if (!(name in obj && typeof obj[name] === type)) {
            return false;
        }
    }
    return true;
}
exports.checkProperties = checkProperties;
