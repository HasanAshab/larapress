const components: Record<string, string | Record<string, string>> = {
  "model": "app/models/{{name}}.ts",
  "trait": "app/traits/{{name}}.ts",
  "factory": "app/factories/{{name}}.ts",
  "mail": "app/mails/{{name}}.ts",
  "listener": "app/listeners/{{name}}.ts",
  "job": "app/jobs/{{name}}.ts",
  "exception": "app/exceptions/{{name}}.ts",
  "controller": "app/http/controllers/{{name}}.ts",
  "validation": "app/http/validations/{{name}}.ts",
  "middleware": {
    "default": "l",
    "l": "app/http/middlewares/{{name}}.ts",
    "g": "illuminate/middlewares/global/{{name}}.ts"
  },
  "command": "app/commands/{{name}}.ts",
  "test": {
    "default": "f",
    "f": "tests/feature/{{name}}.test.js",
    "u": "tests/unit/{{name}}.test.js"
  },
  "router": "routes/{{name}}.ts"
}

export default components;