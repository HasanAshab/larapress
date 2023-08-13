const Notification = require(base("app/models/Notification")).default;

module.exports = {
  get: {
    summary: "Get all notifications",
    auth: true,
    benchmark: {},
    responses: {
      200: {
        schema: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            data: {
              type: "array",
              items: {
                type: "object",
                example: Notification.factory().dummyData(),
              },
            },
            next: { type: "string" },
          },
        },
      },
    },
  },
};
