"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
//import urls from 'register/urls';
//import Middlewares from '/register/middlewares.json';
const urls = {};
const Middlewares = {};
exports.default = {
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
        return `${protocol}://${path.join(`${domain}:${port}`, url_path)}`;
    },
    clientUrl: (url_path = '') => {
        const domain = process.env.CLIENT_DOMAIN;
        const port = process.env.CLIENT_PORT;
        const protocol = 'http';
        //const protocol = port === '443'? 'https' : 'http';
        return `${protocol}://${path.join(`${domain}:${port}`, url_path)}`;
    },
    route: (name, data = {}) => {
        let endpoint = urls[name];
        if (!endpoint) {
            return null;
        }
        if (Object.keys(data).length !== 0) {
            const regex = /:(\w+)/g;
            const params = endpoint.match(regex);
            for (const param of params) {
                endpoint = endpoint.replace(param, data[param.slice(1)]);
            }
        }
        return `${process.env.APP_URL}${endpoint}`;
    },
    storage: (storage_path = '') => {
        return path.join(__dirname, path.join('storage', storage_path));
    },
    middleware: (keys) => {
        var _a, _b;
        function getMiddleware(middlewarePath, options = []) {
            const MiddlewareClass = require(path.join(__dirname, middlewarePath));
            return new MiddlewareClass(options).handle;
        }
        if (Array.isArray(keys)) {
            const middlewares = [];
            for (const key of keys) {
                const [name, params] = key.split(':');
                const middlewarePaths = Middlewares[name];
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
        const middlewarePaths = Middlewares[name];
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
        const envConfig = dotenv.parse(fs.readFileSync('.env'));
        for (const [key, value] of Object.entries(envValues)) {
            envConfig[key] = value;
        }
        return fs.writeFileSync('.env', Object.entries(envConfig).map(([k, v]) => `${k}=${v}`).join('\n'));
    },
    log: (data) => {
        const path = './storage/error.log';
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        fs.appendFile(path, `${data}\n\n\n`, (err) => {
            if (err) {
                throw err;
            }
        });
    },
};
