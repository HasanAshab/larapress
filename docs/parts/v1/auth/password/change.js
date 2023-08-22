module.exports = {
  put: {
    summary: "Change password",
    validationPath: 'Auth/ChangePassword',
    auth: "novice",
    cached: false,
    benchmark: {
      body: JSON.stringify({
        oldPassword: "password",
        password: "Bar@123456",
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
