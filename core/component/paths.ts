export default {
  "model": "app/models/{name}.ts",
  "plugin": {
    "l": "app/plugins/{name}.ts",
    "g": "core/global/plugins/{name}.ts"
  },
  "factory": "database/factories/{name}Factory.ts",
  "seeder": "database/seeders/{name}Seeder.ts",
  "policy": "app/policies/{name}Policy.ts",
  "mail": "app/mails/{name}Mail.ts",
  "notification": "app/notifications/{name}.ts",
  "listener": "app/listeners/{name}.ts",
  "job": "app/jobs/{name}.ts",
  "provider": "app/providers/{name}ServiceProvider.ts",
  "exception": "app/exceptions/{name}Exception.ts",
  "controller": "app/http/{v}/controllers/{name}Controller.ts",
  "request": "app/http/{v}/requests/{name}Request.ts",
  "middleware": {
    "l": "app/http/{v}/middlewares/{name}.ts",
    "g": "core/global/middlewares/{name}.ts"
  },
  "command": "app/commands/{name}.ts",
  "test": {
    "f": "tests/feature/{name}.test.js",
    "u": "tests/unit/{name}.test.js"
  },
  "router": "routes/{name}.ts"
} as const;