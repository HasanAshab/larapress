module.exports = {
  post: {
    summary: "Enable Two Factor Authentication (2FA) for a user",
    description: "need auth-token",
    validationPath: "Settings/EnableTwoFactorAuth",
    responses: {
      200: {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" }
          },
        },
      },
    },
  },
};
