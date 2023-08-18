const FormData = require("form-data");
const User = require(base("app/models/User")).default;

module.exports = {
  get: {
    summary: "Get own profile",
    auth: "novice",
    benchmark: {},
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
  put: {
    summary: "Update own user details",
    validationPath: "Auth/UpdateProfile",
    auth: "novice",
    cached: false,
    benchmark: {
      setupRequest(req) {
        const form = new FormData();
        form.append("username", this.user.username + "jr");
        Object.assign(req.headers, form.getHeaders());
        req.body = form.getBuffer();
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
            message: {
              type: "string",
            },
          },
        },
      },
    },
  },
};
