const User = require(base("app/models/User")).default;

module.exports = {
  get: {
    summary: "Get a specific users profile",
    auth: "novice",
    benchmark: {
      params() {
        return { 
          username: this.user.username
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
              example: User.factory().dummyData()
            }
          },
        },
      },
    },
  },
  
  delete: {
    summary: "Delete user",
    auth: "admin",
    benchmark: {
      async params() {
        return { 
          username: (await User.factory().create()).username
        }
      }
    },
    responses: {
      204: {
        description: "User deleted"
      }
    }
  }
};
