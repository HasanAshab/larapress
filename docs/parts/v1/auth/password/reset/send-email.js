const User = require(base("app/models/User")).default;

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
      body: JSON.stringify({
        email: this.email,
      })
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
