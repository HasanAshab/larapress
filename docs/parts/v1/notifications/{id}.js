module.exports = {
  post: {
    summary: "Mark notification as read",
    auth: true,
    benchmark: {
      params: { id: "notificationId" }
    },
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
    auth: true,
    benchmark: {
      params: { id: "notificationId" }
    },
    responses: {
      204: {
        description: "Notification deleted"
      },
    },
  }
};
