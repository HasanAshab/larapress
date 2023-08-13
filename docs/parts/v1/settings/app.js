const { env, toCamelCase } = require(base("helpers"));

const envData = env();
const camelCaseEnv = {};

for (const key in envData) {
  const camelCaseKey = toCamelCase(key.toLowerCase());
  camelCaseEnv[camelCaseKey] = envData[key];
}

module.exports = {
  get: {
    summary: "Get app settings (ENV)",
    admin: true,
    benchmark: {},
    responses: {
      200: {
        schema: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            data: {
              type: "object",
              example: camelCaseEnv
            },
          },
        },
      },
    },
  },
  put: {
    summary: "Update app settings (ENV)",
    validationPath: "Settings/Update",
    admin: true,
    benchmark: {
      body: JSON.stringify({
        appName: "Foo" 
      })
    },
    responses: {
      200: {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
          },
        },
      },
    },
  }
};
