"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const urls_1 = __importDefault(require("register/urls"));
const middlewares_1 = __importDefault(require("register/middlewares"));
exports.default = {
    base: (base_path = '') => {
        return path_1.default.join(__dirname, base_path);
    },
    isClass: (target) => {
        return typeof target === 'function' && /^\s*class\s+/.test(target.toString());
    },
    isObject: (target) => {
        return typeof target === 'object' && target !== null && !Array.isArray(target);
    },
    capitalizeFirstLetter: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    url: (url_path = '') => {
        const domain = process.env.APP_DOMAIN;
        const port = process.env.APP_PORT;
        const protocol = 'http';
        //const protocol = port === '443'? 'https' : 'http';
        return `${protocol}://${path_1.default.join(`${domain}:${port}`, url_path)}`;
    },
    clientUrl: (url_path = '') => {
        const domain = process.env.CLIENT_DOMAIN;
        const port = process.env.CLIENT_PORT;
        const protocol = 'http';
        //const protocol = port === '443'? 'https' : 'http';
        return `${protocol}://${path_1.default.join(`${domain}:${port}`, url_path)}`;
    },
    route: (name, data = {}) => {
        let endpoint = urls_1.default[name];
        if (!endpoint) {
            return null;
        }
        if (Object.keys(data).length !== 0) {
            const regex = /:(\w+)/g;
            const params = endpoint.match(regex);
            if (params) {
                for (const param of params) {
                    endpoint = endpoint.replace(param, data[param.slice(1)]);
                }
            }
        }
        return `${process.env.APP_URL}${endpoint}`;
    },
    storage: (storage_path = '') => {
        return path_1.default.join(__dirname, path_1.default.join('storage', storage_path));
    },
    middleware: (keys) => {
        var _a, _b;
        function getMiddleware(middlewarePath, options = []) {
            const MiddlewareClass = require(path_1.default.join(__dirname, middlewarePath));
            return new MiddlewareClass(options).handle;
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
    },
    setEnv: (envValues) => {
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
    },
    log: (data) => {
        const path = './storage/error.log';
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        fs_1.default.appendFile(path, `${data}\n\n\n`, (err) => {
            if (err) {
                throw err;
            }
        });
    },
};
