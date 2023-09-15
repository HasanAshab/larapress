const User = require("~/app/models/User").default;
const Settings = require("~/app/models/Settings").default;

module.exports = {
  post: {
    summary: "Login a User",
    description: "Returns api token if credentials match",
    validationPath: "Auth/Login",
    benchmark: {
      async setupContext(){
        const user = await User.factory().hasSettings(true).create();
        return { email: user.email };
      },

      setupRequest(req) {
        req.body = JSON.stringify({
          email: this.email,
          password: "password"
        });
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
            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                },
              },
            },
            twoFactorAuthRequired: {
              type: "boolean",
              description: "if its true then you need to pass otp also",
            },
          },
        },
      },
    },
  },
};
