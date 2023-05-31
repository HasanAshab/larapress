module.exports = {
  put: {
    summary: "Change password",
    description: "need bearer token",
    validationPath: 'Auth/ChangePassword',
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
