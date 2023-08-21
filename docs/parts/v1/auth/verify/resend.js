module.exports = {
  get: {
    summary: "Resend account verification email",
    validationPath: "Auth/ResendEmailVerification",
    preset: ["signature"],
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
