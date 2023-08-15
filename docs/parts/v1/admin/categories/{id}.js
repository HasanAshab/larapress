const Category = require(base("app/models/Category")).default;

module.exports = {
  get: {
    summary: "Get a specific category",
    auth: "admin",
    benchmark: {
      async params() {
        return { 
          id: (await Category.factory().create())._id
        }
      }
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
