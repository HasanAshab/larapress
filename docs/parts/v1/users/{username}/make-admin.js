module.exports = {
  put: {
    summary: "Give Admin role to a User",
    auth: "admin",
    benchmark: {
      params() {
        return { username: "2foo" };
      }
    },
    responses: {
      200: {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" } 
          },
        },
      },
    },
  },
};
