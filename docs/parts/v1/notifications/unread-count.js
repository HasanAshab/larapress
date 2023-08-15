module.exports = {
  get: {
    summary: "Get unread notifications count",
    auth: "novice",
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
              type: "object",
              properties: {
                count: {
                  type: "number",
                }
              }
            },
          },
        },
      },
    },
  },
};
