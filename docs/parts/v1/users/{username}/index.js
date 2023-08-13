const User = require(base("app/models/User")).default;

module.exports = {
  get: {
    summary: "Get a specific users profile",
    auth: true,
    benchmark: {
      params: { username: "0foo" }
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
              example: User.factory().dummyData()
            }
          },
        },
      },
    },
  },
  
  delete: {
    summary: "Delete user",
    admin: true,
    benchmark: {
      params: { username: "1foo" }
    },
    responses: {
      204: {
        description: "User deleted"
      }
    }
  }
};
