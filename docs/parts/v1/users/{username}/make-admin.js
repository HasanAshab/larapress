module.exports = {
  put: {
    summary: "Give Admin role to a User",
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
