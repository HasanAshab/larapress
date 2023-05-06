"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require('dotenv');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var urls = require(path.join(__dirname, '/register/urls'));
var Middlewares = require(path.join(__dirname, '/register/middlewares'));
exports.default = {
    base: function (base_path) {
        if (base_path === void 0) { base_path = ''; }
        return path.join(__dirname, base_path);
    },
    isClass: function (target) {
        return typeof target === 'function' && /^\s*class\s+/.test(target.toString());
    },
    isObject: function (target) {
        return typeof target === 'object' && target !== null && !Array.isArray(target);
    },
    capitalizeFirstLetter: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    url: function (url_path) {
        if (url_path === void 0) { url_path = ''; }
        var domain = process.env.APP_DOMAIN;
        var port = process.env.APP_PORT;
        var protocol = 'http';
        //const protocol = port === '443'? 'https' : 'http';
        return "".concat(protocol, "://").concat(path.join("".concat(domain, ":").concat(port), url_path));
    },
    clientUrl: function (url_path) {
        if (url_path === void 0) { url_path = ''; }
        var domain = process.env.CLIENT_DOMAIN;
        var port = process.env.CLIENT_PORT;
        var protocol = 'http';
        //const protocol = port === '443'? 'https' : 'http';
        return "".concat(protocol, "://").concat(path.join("".concat(domain, ":").concat(port), url_path));
    },
    route: function (name, data) {
        if (data === void 0) { data = {}; }
        var endpoint = urls[name];
        if (!endpoint) {
            return null;
        }
        if (Object.keys(data).length !== 0) {
            var regex = /:(\w+)/g;
            var params = endpoint.match(regex);
            for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
                var param = params_1[_i];
                endpoint = endpoint.replace(param, data[param.slice(1)]);
            }
        }
        return "".concat(process.env.APP_URL).concat(endpoint);
    },
    storage: function (storage_path) {
        if (storage_path === void 0) { storage_path = ''; }
        return path.join(__dirname, path.join('storage', storage_path));
    },
    middleware: function (keys) {
        var _a, _b;
        function getMiddleware(middlewarePath, options) {
            if (options === void 0) { options = []; }
            var MiddlewareClass = require(path.join(__dirname, middlewarePath));
            return new MiddlewareClass(options).handle;
        }
        if (Array.isArray(keys)) {
            var middlewares = [];
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var _c = key.split(':'), name_1 = _c[0], params_2 = _c[1];
                var middlewarePaths_1 = Middlewares[name_1];
                if (Array.isArray(middlewarePaths_1)) {
                    var funcBasedParams = params_2 === null || params_2 === void 0 ? void 0 : params_2.split('|');
                    for (var i = 0; i < middlewarePaths_1.length; i++) {
                        var middleware = getMiddleware(middlewarePaths_1[i], (_a = funcBasedParams === null || funcBasedParams === void 0 ? void 0 : funcBasedParams[i]) === null || _a === void 0 ? void 0 : _a.split(','));
                        middlewares.push(middleware);
                    }
                }
                else {
                    var middleware = getMiddleware(middlewarePaths_1, params_2 === null || params_2 === void 0 ? void 0 : params_2.split(','));
                    middlewares.push(middleware);
                }
            }
            return middlewares;
        }
        var _d = keys.split(':'), name = _d[0], params = _d[1];
        var middlewarePaths = Middlewares[name];
        if (middlewarePaths instanceof Array) {
            var middlewares = [];
            var funcBasedParams = typeof params !== 'undefined'
                ? params.split('|') : undefined;
            for (var i = 0; i < middlewarePaths.length; i++) {
                var middleware = getMiddleware(middlewarePaths[i], (_b = funcBasedParams === null || funcBasedParams === void 0 ? void 0 : funcBasedParams[i]) === null || _b === void 0 ? void 0 : _b.split(','));
                middlewares.push(middleware);
            }
            return middlewares;
        }
        return getMiddleware(middlewarePaths, params === null || params === void 0 ? void 0 : params.split(','));
    },
    setEnv: function (envValues) {
        var envConfig = dotenv.parse(fs.readFileSync('.env'));
        for (var _i = 0, _a = Object.entries(envValues); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            envConfig[key] = value;
        }
        return fs.writeFileSync('.env', Object.entries(envConfig).map(function (_a) {
            var k = _a[0], v = _a[1];
            return "".concat(k, "=").concat(v);
        }).join('\n'));
    },
    log: function (data) {
        var path = './storage/error.log';
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        fs.appendFile(path, "".concat(data, "\n\n\n"), function (err) {
            if (err) {
                throw err;
            }
        });
    },
};
