"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEndpointsFromDirTree = exports.passErrorsToHandler = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function passErrorsToHandler(fn) {
    if (fn.length === 4) {
        return async function (err, req, res, next) {
            try {
                await fn(err, req, res, next);
            }
            catch (err) {
                next(err);
            }
        };
    }
    return async function (req, res, next) {
        try {
            await fn(req, res, next);
        }
        catch (err) {
            next(err);
        }
    };
    /*
    return async function (...args) {
      try {
        await fn(...args);
      } catch (err) {
        args[fn.length - 1](err);
      }
    };
    */
}
exports.passErrorsToHandler = passErrorsToHandler;
;
function generateEndpointsFromDirTree(rootPath, cb) {
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
                    .toLowerCase();
                cb(itemPathEndpoint, itemPath);
            }
            else if (status.isDirectory()) {
                stack.push(itemPath);
            }
        }
    }
}
exports.generateEndpointsFromDirTree = generateEndpointsFromDirTree;
