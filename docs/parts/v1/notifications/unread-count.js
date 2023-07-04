module.exports = {
  get: {
    summary: "Get unread notifications count",
    description: "need auth-token",
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
