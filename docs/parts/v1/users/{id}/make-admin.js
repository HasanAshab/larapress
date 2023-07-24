module.exports = {
  put: {
    summary: "Give Admin role to a User",
    description: "need auth-token, admin",
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
