module.exports = {
  put: {
    summary: "Change password",
    validationPath: 'Auth/ChangePassword',
    auth: "novice",
    benchmark: {
      body: JSON.stringify({
        oldPassword: "password",
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
