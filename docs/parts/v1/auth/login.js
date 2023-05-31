module.exports = {
  post: {
    summary: "Login a User",
    description: "Returns api token if credentials match",
    validationPath: "Auth/Login",
    responses: {
      200: {
        schema: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            message: {
              type: "string",
            },
            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
};
