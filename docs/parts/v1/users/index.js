const User = require("~/app/models/User").default;

module.exports = {
  get: {
    summary: "Get all users",
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
              type: "array",
              items: {
                type: "object",
                example: User.factory().definition()
              },
            },
            next: { type: "string" },
          },
        },
      },
    },
  },
};
