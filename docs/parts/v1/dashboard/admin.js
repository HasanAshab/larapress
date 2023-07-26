module.exports = {
  get: {
    summary: "Get dashboard",
    description: "need auth-token, admin",
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
                totalUsers: "number",
                newUsersToday: "number"
              },
            },
          },
        },
      },
    },
  },
};
