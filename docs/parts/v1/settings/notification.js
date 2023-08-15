module.exports = {
  put: {
    summary: "Update user notification settings",
    validationPath: "Settings/Notification",
    auth: "novice",
    benchmark: {
      body: JSON.stringify({
        feature: { 
          email: false, 
          site: true
        }
      })
    },
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
