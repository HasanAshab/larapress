"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const components = {
    "model": "app/models/{{name}}.js",
    "trait": "app/traits/{{name}}.js",
    "factory": "app/factories/{{name}}.js",
    "mail": "app/mails/{{name}}.js",
    "listener": "app/listeners/{{name}}.js",
    "job": "app/jobs/{{name}}.js",
    "exception": "app/exceptions/{{name}}.js",
    "controller": "app/http/controllers/{{name}}.js",
    "validation": "app/http/validations/{{prefix}}/{{name}}.js",
    "middleware": "app/http/middlewares/{{name}}.js",
    "command": "app/commands/{{name}}.js",
    "test": {
        "feature": "tests/feature/{{name}}.test.js",
        "unit": "tests/unit/{{name}}.test.js"
    },
    "router": "routes/{{prefix}}/{{name}}.js"
};
exports.default = components;
