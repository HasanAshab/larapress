module.exports = {
  put: {
    summary: "Reset password",
    validationPath: base('app/http/validations/Auth/ResetPassword'),
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
