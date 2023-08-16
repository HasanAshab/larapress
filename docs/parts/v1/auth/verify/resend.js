const User = require(base("app/models/User")).default;

module.exports = {
  get: {
    summary: "Resend account verification email",
    validationPath: "Auth/ResendEmailVerification",
    benchmark: {
      async setupRequest(req) {
        req.body = JSON.stringify(await User.findOne().select("email"));
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
