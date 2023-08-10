module.exports = {
  put: {
    summary: "Update user notification settings",
    description: "need auth-token",
    validationPath: "Settings/Notification",
    responses: {
      200: {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
          },
        },
      },
    },
  },
};
