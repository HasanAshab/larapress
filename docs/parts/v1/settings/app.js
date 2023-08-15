module.exports = {
  get: {
    summary: "Get app settings (ENV)",
    auth: "admin",
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
              example: require("config")
            },
          },
        },
      },
    },
  },
  put: {
    summary: "Update app settings (ENV)",
    validationPath: "Settings/UpdateAppSettings",
    auth: "admin",
    benchmark: {
      body: JSON.stringify({
        app: { name: "Foo" } 
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
