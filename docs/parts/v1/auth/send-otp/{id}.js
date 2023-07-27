module.exports = {
  post: {
    summary: "Send One Time Password (OTP) code to user's phone number",
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
