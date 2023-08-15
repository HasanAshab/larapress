module.exports = {
  Put: {
    summary: "Set or Update user's phone number",
    validationPath: "Auth/ChangePhoneNumber",
    auth: "novice",
    benchmark: {
      body: JSON.stringify({
        phoneNumber: "+15000673765"
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
