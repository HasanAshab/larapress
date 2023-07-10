module.exports = {
  post: {
    summary: "Mark notification as read",
    description: "need auth-token",
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
            }
          },
        },
      },
    },
  },
  delete: {
    summary: "Remove notification",
    description: "need auth-token",
    responses: {
      204: {
        description: "Notification deleted"
      },
    },
  }
};
