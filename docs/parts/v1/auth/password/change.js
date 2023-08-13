module.exports = {
  put: {
    summary: "Change password",
    validationPath: 'Auth/ChangePassword',
    auth: true,
    benchmark: {
      body: JSON.stringify({
        oldPassword: "foo.123456",
        password: "bar.123456",
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
