module.exports = {
  delete: {
    summary: "Remove notification",
    description: "need auth-token",
    responses: {
      204: {
        description: "Notification deleted"
      },
    },
  },
};
