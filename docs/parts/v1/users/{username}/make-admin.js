const User = require("~/app/models/User").default;

module.exports = {
  put: {
    summary: "Give Admin role to a User",
    auth: "admin",
    benchmark: {
      async params() {
        return {
          username: (await User.factory().create()).username
        }
      }
    },
    responses: {
      200: {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" } 
          },
        },
      },
    },
  },
};
