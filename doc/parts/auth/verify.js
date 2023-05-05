module.exports = {
  get: {
    summary: "Verify User account",
    description: "Generally this endpoint will sent to user email with a token. user can use the token here to verify their account. After verification they will redirect to Frontend app",
    validationPath: base('app/http/validations/Auth/VerifyEmail'),
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
