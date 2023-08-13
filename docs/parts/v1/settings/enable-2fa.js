module.exports = {
  post: {
    summary: "Enable Two Factor Authentication (2FA)",
    validationPath: "Settings/EnableTwoFactorAuth",
    auth: true,
    benchmark: {
      body: JSON.stringify({ 
        method: "sms",
        otp: "123456"
      })
    },
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
