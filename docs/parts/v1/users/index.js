const User = require(base("app/models/User")).default;

module.exports = {
  get: {
    summary: "Get all users",
    description: "need auth-token, admin",
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
                example: User.factory().dummyData()
              },
            },
            next: { type: "string" },
          },
        },
      },
    },
  },
};
