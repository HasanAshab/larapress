const User = require(base("app/models/User")).default;

module.exports = {
  get: {
    summary: "Verify User account",
    benchmark: {
      async params(){
        return { 
          id: (await User.findOne() ?? await User.factory().create())._id
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
            message: {
              type: "string",
            },
          },
        },
      },
    },
  },
};
