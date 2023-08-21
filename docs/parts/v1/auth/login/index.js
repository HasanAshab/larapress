const User = require(base("app/models/User")).default;
const Settings = require(base("app/models/Settings")).default;

module.exports = {
  post: {
    summary: "Login a User",
    description: "Returns api token if credentials match",
    validationPath: "Auth/Login",
    benchmark: {
      async setupContext(){
        const user = await User.factory().create();
        await Settings.create({
          userId: user._id, 
          twoFactorAuth: { enabled: true }
        });
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
