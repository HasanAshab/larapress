"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParams = exports.checkProperties = exports.getVersion = exports.log = exports.setEnv = exports.controller = exports.middleware = exports.storage = exports.route = exports.clientUrl = exports.url = exports.capitalizeFirstLetter = exports.base = void 0;
var dotenv_1 = require("dotenv");
var fs_1 = require("fs");
var path_1 = require("path");
var urls_1 = require("register/urls");
var middlewares_1 = require("register/middlewares");
function base(base_path) {
    if (base_path === void 0) { base_path = ""; }
    return path_1.default.join(__dirname, base_path);
}
exports.base = base;
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function url(url_path) {
    if (url_path === void 0) { url_path = ""; }
    var domain = process.env.APP_DOMAIN;
    var port = process.env.APP_PORT;
    var protocol = "http";
    //const protocol = port === "443"? "https" : "http";
    return "".concat(protocol, "://").concat(path_1.default.join("".concat(domain, ":").concat(port), url_path));
}
exports.url = url;
function clientUrl(url_path) {
    if (url_path === void 0) { url_path = ""; }
    var domain = process.env.CLIENT_DOMAIN;
    var port = process.env.CLIENT_PORT;
    var protocol = "http";
    //const protocol = port === "443"? "https" : "http";
    return "".concat(protocol, "://").concat(path_1.default.join("".concat(domain, ":").concat(port), url_path));
}
exports.clientUrl = clientUrl;
function route(name, data) {
    var _a;
    var endpoint = urls_1.default[name];
    if (!endpoint) {
        throw new Error("Endpoint not found!");
    }
    if (data) {
        var regex = /:(\w+)/g;
        var params = endpoint.match(regex);
        if (params) {
            for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
                var param = params_1[_i];
                endpoint = endpoint.replace(param, (_a = data[param.slice(1)]) === null || _a === void 0 ? void 0 : _a.toString());
            }
        }
    }
    return "".concat(process.env.APP_URL).concat(endpoint);
}
exports.route = route;
function storage(storage_path) {
    if (storage_path === void 0) { storage_path = ""; }
    return path_1.default.resolve(path_1.default.join("storage", storage_path));
}
exports.storage = storage;
function middleware(keys, version) {
    var _a, _b;
    function getMiddleware(middlewarePath, options) {
        if (options === void 0) { options = []; }
        var fullPath = middlewarePath.startsWith("<global>")
            ? middlewarePath.replace("<global>", "illuminate/middlewares/global")
            : "app/http/".concat(version !== null && version !== void 0 ? version : getVersion(), "/middlewares/").concat(middlewarePath);
        var MiddlewareClass = require(path_1.default.resolve(fullPath)).default;
        var middlewareInstance = new MiddlewareClass(options);
        var handler = middlewareInstance.handle.bind(middlewareInstance);
        return handler;
    }
    if (Array.isArray(keys)) {
        var middlewares = [];
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var _c = key.split(":"), name_1 = _c[0], params_2 = _c[1];
            var middlewarePaths_1 = middlewares_1.default[name_1];
            if (Array.isArray(middlewarePaths_1)) {
                var funcBasedParams = params_2 === null || params_2 === void 0 ? void 0 : params_2.split("|");
                for (var i = 0; i < middlewarePaths_1.length; i++) {
                    var middleware_1 = getMiddleware(middlewarePaths_1[i], (_a = funcBasedParams === null || funcBasedParams === void 0 ? void 0 : funcBasedParams[i]) === null || _a === void 0 ? void 0 : _a.split(","));
                    middlewares.push(middleware_1);
                }
            }
            else {
                var middleware_2 = getMiddleware(middlewarePaths_1, params_2 === null || params_2 === void 0 ? void 0 : params_2.split(","));
                middlewares.push(middleware_2);
            }
        }
        return middlewares;
    }
    var _d = keys.split(":"), name = _d[0], params = _d[1];
    var middlewarePaths = middlewares_1.default[name];
    if (middlewarePaths instanceof Array) {
        var middlewares = [];
        var funcBasedParams = typeof params !== "undefined"
            ? params.split("|") : undefined;
        for (var i = 0; i < middlewarePaths.length; i++) {
            var middleware_3 = getMiddleware(middlewarePaths[i], (_b = funcBasedParams === null || funcBasedParams === void 0 ? void 0 : funcBasedParams[i]) === null || _b === void 0 ? void 0 : _b.split(","));
            middlewares.push(middleware_3);
        }
        return middlewares;
    }
    return getMiddleware(middlewarePaths, params === null || params === void 0 ? void 0 : params.split(","));
}
exports.middleware = middleware;
function controller(name, version) {
    version = version !== null && version !== void 0 ? version : getVersion();
    var controllerPath = path_1.default.resolve(path_1.default.join("app/http/".concat(version, "/controllers"), name));
    var controllerClass = require(controllerPath).default;
    var controllerInstance = new controllerClass;
    var controllerPrefix = controllerClass.name.replace("Controller", "");
    var methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance)).filter(function (name) { return name !== "constructor" && typeof controllerInstance[name] === 'function'; });
    var handlerAndValidatorStack = {};
    for (var _i = 0, methodNames_1 = methodNames; _i < methodNames_1.length; _i++) {
        var methodName = methodNames_1[_i];
        var validationSubPath = "".concat(controllerPrefix, "/").concat(capitalizeFirstLetter(methodName));
        handlerAndValidatorStack[methodName] = [
            middleware("validate:".concat(version, ",").concat(validationSubPath)),
            controllerInstance[methodName]
        ];
    }
    return handlerAndValidatorStack;
}
exports.controller = controller;
function setEnv(envValues) {
    var envConfig = dotenv_1.default.parse(fs_1.default.readFileSync(".env"));
    for (var _i = 0, _a = Object.entries(envValues); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        envConfig[key] = value;
    }
    try {
        fs_1.default.writeFileSync(".env", Object.entries(envConfig).map(function (_a) {
            var k = _a[0], v = _a[1];
            return "".concat(k, "=").concat(v);
        }).join("\n"));
        return true;
    }
    catch (err) {
        throw err;
    }
}
exports.setEnv = setEnv;
function log(data) {
    var path = "./storage/error.log";
    if (typeof data === "object") {
        data = JSON.stringify(data);
    }
    fs_1.default.appendFile(path, "".concat(data, "\n\n\n"), function (err) {
        if (err) {
            throw err;
        }
    });
}
exports.log = log;
function getVersion(path) {
    var target;
    if (typeof path === "undefined") {
        var error = new Error();
        var stackTrace = error.stack;
        if (!stackTrace)
            throw new Error("Failed to auto infer version. try to pass target path!");
        target = stackTrace;
    }
    else
        target = path;
    var regex = /\/(v\d+)\//;
    var match = target.match(regex);
    if (!match)
        throw new Error('This path is not a nested versional path!');
    return match[1];
}
exports.getVersion = getVersion;
function checkProperties(obj, properties) {
    for (var _i = 0, _a = Object.entries(properties); _i < _a.length; _i++) {
        var _b = _a[_i], name_2 = _b[0], type = _b[1];
        if (!(name_2 in obj && typeof obj[name_2] === type)) {
            return false;
        }
    }
    return true;
}
exports.checkProperties = checkProperties;
function getParams(func) {
    var str = func.toString();
    str = str.replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/(.)*/g, "")
        .replace(/{[\s\S]*}/, "")
        .replace(/=>/g, "")
        .trim();
    var start = str.indexOf("(") + 1;
    var end = str.length - 1;
    var result = str.substring(start, end).split(", ");
    var params = [];
    result.forEach(function (element) {
        element = element.replace(/=[\s\S]*/g, "").trim();
        if (element.length > 0)
            params.push(element);
    });
    return params;
}
exports.getParams = getParams;
