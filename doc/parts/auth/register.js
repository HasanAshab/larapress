module.exports = {
  post: {
    summary: "Sign-up a User",
    description: "Returns api token and verification email will be sent to user",
    validationPath: base('app/http/validations/Auth/Register'),
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
            token: {
              type: "string",
            },
          },
        },
      },
    },
  },
};
