const User = require(base("app/models/User")).default;

module.exports = {
  get: {
    summary: "Get a specific users profile",
    auth: "novice",
    benchmark: {
      params() {
        console.log(this)
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
      async *params() {
        let i = 0;
        while(true){
          yield { 
            username: (await User.factory().create({ username: "testUser" + i++})).username
          }
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
