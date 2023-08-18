const Notification = require(base("app/models/Notification")).default;

module.exports = {
  post: {
    summary: "Mark notification as read",
    auth: "novice",
    benchmark: {
      async params() {
        const notification = await Notification.factory().create({
          notifiableId: this.user._id,
          readAt: null
        });
        return { id: notification._id }
      }
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
    auth: "novice",
    benchmark: {
      async params() {
        return {
          id: (await this.user.notifications)[0]._id
        }
      }
    },
    responses: {
      204: {
        description: "Notification deleted"
      },
    },
  }
};
