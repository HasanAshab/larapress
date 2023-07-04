module.exports = {
  get: {
    summary: "Resend account verification email",
    validationPath: "Auth/ResendEmailVerification",
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
