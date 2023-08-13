module.exports = {
  get: {
    summary: "Get dashboard",
    admin: true,
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
