"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const components = {
    "model": "app/models/{name}.ts",
    "plugin": "app/plugins/{name}.ts",
    "factory": "app/factories/{name}.ts",
    "mail": "app/mails/{name}.ts",
    "listener": "app/listeners/{name}.ts",
    "job": "app/jobs/{name}.ts",
    "exception": "app/exceptions/{name}.ts",
    "controller": "app/http/{v}/controllers/{name}Controller.ts",
    "validation": "app/http/{v}/validations/{name}.ts",
    "middleware": {
        "default": "l",
        "l": "app/http/{v}/middlewares/{name}.ts",
        "g": "illuminate/middlewares/global/{name}.ts"
    },
    "command": "app/commands/{name}.ts",
    "test": {
        "default": "f",
        "f": "tests/feature/{name}.test.js",
        "u": "tests/unit/{name}.test.js"
    },
    "router": "routes/{name}.ts"
};
exports.default = components;
