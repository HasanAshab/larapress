const User = require("~/app/models/User").default;

module.exports = {
  post: {
    summary: "Forgot password",
    description: "This will sent an password reset email if user is exist on the app",
    validationPath: 'Auth/SendPasswordResetEmail',
    benchmark: {
      async setupContext() {
        return {
          email:  (await User.findOne()).email
        }
      },
      setupRequest(req) {
        req.body = JSON.stringify(this);
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
