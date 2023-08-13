const config = require("config");

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
              example: config
            },
          },
        },
      },
    },
  },
  put: {
    summary: "Update app settings (ENV)",
    validationPath: "Settings/UpdateAppSettings",
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
