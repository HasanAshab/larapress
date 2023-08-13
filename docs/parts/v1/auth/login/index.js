module.exports = {
  post: {
    summary: "Login a User",
    description: "Returns api token if credentials match",
    validationPath: "Auth/Login",
    benchmark: {
      body: JSON.stringify({
        email: "0foo@gmail.com",
        password: "foo.123456"
      })
    },
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
            twoFactorAuthRequired: {
              type: "boolean",
              description: "if its true then you need to pass otp also",
            },
          },
        },
      },
    },
  },
};
