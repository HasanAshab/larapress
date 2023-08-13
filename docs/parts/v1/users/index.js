const User = require(base("app/models/User")).default;

module.exports = {
  get: {
    summary: "Get all users",
    auth: "admin",
    benchmark: {
      async setupContext(){
        return {
          foo: await User.factory().create()
        }
      },
      setupRequest(req){
        console.log(this)
        return req;
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
              type: "array",
              items: {
                type: "object",
                example: User.factory().dummyData()
              },
            },
            next: { type: "string" },
          },
        },
      },
    },
  },
};
