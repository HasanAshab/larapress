const Notification = require("~/app/models/Notification").default;

module.exports = {
  post: {
    summary: "Mark notification as read",
    auth: "novice",
    benchmark: {
      async *params() {
        while(true){
          yield { 
            id: (await Notification.factory().create({
              userId: this.user._id,
              readAt: null
            }))._id 
          }
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
      async *params() {
        while(true){
          yield { 
            id: (await Notification.factory().create({
              userId: this.user._id,
            }))._id 
          }
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
