module.exports = {
  get: {
    summary: "Login a User (Google)",
    benchmark: {},
    responses: {
      302: {
        schema: {
          type: "object",
          description: "User is redirected to google auth"
        },
      },
    },
  },
};
