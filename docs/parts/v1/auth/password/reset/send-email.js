module.exports = {
  post: {
    summary: "Forgot password",
    description: "This will sent an password reset email if user is exist on the app",
    validationPath: 'Auth/SendPasswordResetEmail',
    benchmark: {
      body: JSON.stringify({
        email: "0foo@gmail.com",
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
