module.exports = {
  put: {
    summary: "Reset password",
    validationPath: 'Auth/ResetPassword',
    benchmark: {
      body: JSON.stringify({
        token: "resetToken",
        password: "baz.123456"
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
