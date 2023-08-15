module.exports = {
  get: {
    summary: "Get dashboard",
    auth: "admin",
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
