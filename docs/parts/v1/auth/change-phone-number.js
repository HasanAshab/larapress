module.exports = {
  Put: {
    summary: "Set or Update user's phone number",
    validationPath: "Auth/ChangePhoneNumber",
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
