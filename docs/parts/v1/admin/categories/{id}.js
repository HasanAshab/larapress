const Category = require(base("app/models/Category")).default;

module.exports = {
  get: {
    summary: "Get a specific category",
    admin: true,
    benchmark: {
      params: { id: "adminId" }
    },
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
