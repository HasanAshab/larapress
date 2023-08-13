module.exports = {
  post: {
    summary: "Send One Time Password (OTP) code to user's phone number",
    validationPath: "Auth/SendOtp",
    benchmark: {
      body: JSON.stringify({
        userId: "",
        method: "sms"
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
