module.exports = {
  post: {
    summary: "Mark notification as read",
    description: "need auth-token",
    responses: {
      200: {
        description: "Notification deleted"
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
