const Category = require(base("app/models/Category")).default;

module.exports = {
  get: {
    summary: "Get a specific category",
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
              type: "object",
              example: Category.factory().dummyData()
            }
          },
        },
      },
    },
  },
};
