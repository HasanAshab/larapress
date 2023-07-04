module.exports = {
  get: {
    summary: "Get all notifications",
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
                notifications: {
                  type: "array",
                  items: {
                    type: "object",
                  }
                }
              }
            },
          },
        },
      },
    },
  },
};
