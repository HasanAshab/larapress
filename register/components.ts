const components: Record<string, string | Record<string, string>> = {
  "model": "app/models/{name}.ts",
  "plugin": {
    "default": "l",
    "l": "app/plugins/{name}.ts",
    "g": "core/global/plugins/{name}.ts"
  },
  "factory": "app/factories/{name}Factory.ts",
  "policy": "app/policies/{name}.ts",
  "mail": "app/mails/{name}.ts",
  "notification": "app/notifications/{name}.ts",
  "listener": "app/listeners/{name}.ts",
  "job": "app/jobs/{name}.ts",
  "exception": "app/exceptions/{name}.ts",
  "controller": "app/http/{v}/controllers/{name}Controller.ts",
  "validation": "app/http/{v}/validations/{name}.ts",
  "middleware": {
    "default": "l",
    "l": "app/http/{v}/middlewares/{name}.ts",
    "g": "core/global/middlewares/{name}.ts"
  },
  "command": "app/commands/{name}.ts",
  "test": {
    "default": "f",
    "f": "tests/feature/{name}.test.js",
    "u": "tests/unit/{name}.test.js"
  },
  "router": "routes/{name}.ts"
}

export default components;