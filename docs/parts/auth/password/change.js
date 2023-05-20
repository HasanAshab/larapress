module.exports = {
  put: {
    summary: "Change password",
    description: "need bearer token",
    validationPath: base('app/http/validations/Auth/ChangePassword'),
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
