module.exports = {
  post: {
    summary: "Sign-up a User",
    description:
      "Returns api token and verification email will be sent to user",
    validationPath: "Auth/Register",
    responses: {
      201: {
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
