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
  "middleware": "app/http/middlewares/{{name}}.ts",
  "command": "app/commands/{{name}}.ts",
  "test": {
    "default": "f",
    "f": "tests/feature/{{name}}.test.js",
    "u": "tests/unit/{{name}}.test.js"
  },
  "router": "routes/{{name}}.ts"
}

export default components;