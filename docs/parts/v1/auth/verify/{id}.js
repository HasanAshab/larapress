const User = require(base("app/models/User")).default;

module.exports = {
  get: {
    summary: "Verify User account",
    benchmark: {
      async setupContext(){
        return {
          userId: (await User.factory().create())._id
        }
      },

      params(){
        return { id: this.userId}
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
