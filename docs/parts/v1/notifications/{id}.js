const Notification = require(base("app/models/Notification")).default;

module.exports = {
  post: {
    summary: "Mark notification as read",
    auth: "novice",
    benchmark: {
      async params() {
        return {
          id: (await Notification.factory().create())._id
        }
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
          id: (await Notification.factory().create())._id
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
