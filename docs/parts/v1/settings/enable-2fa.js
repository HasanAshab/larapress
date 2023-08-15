module.exports = {
  post: {
    summary: "Enable Two Factor Authentication (2FA)",
    validationPath: "Settings/EnableTwoFactorAuth",
    auth: "novice",
    benchmark: {
      async setupRequest(req) { 
        req.body = JSON.stringify({ 
          method: "sms",
          otp: await this.user.sendOtp("sms")
        });
        return req;
      }
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
