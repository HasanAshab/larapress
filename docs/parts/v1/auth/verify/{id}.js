const User = require(base("app/models/User")).default;
let token;

module.exports = {
  get: {
    summary: "Verify User account",
    benchmark: {
      params() {
        console.log(this)
        return { id: this.user._id }
      },
      async setupContext(){
        return {
          user: await User.factory().create({ verified: false })
        }
      },
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
