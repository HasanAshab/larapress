const Category = require(base("app/models/Category")).default;

module.exports = {
  get: {
    summary: "Get all categories",
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
                example: Category.factory().dummyData()
              },
            },
            next: { type: "string" },
          },
        },
      },
    },
  },
};