module.exports = {
  post: {
    summary: "Sign-up a User",
    description: "Returns api token and verification email will be sent to user",
  //  parameters: [
      {
        name: "name",
        type: "string",
        in: "body",
        required: true,
        example: "Shamim Bhai",
      },
      {
        name: "email",
        type: "string",
        in: "body",
        required: true,
        example: "Shamim@leader.com",
      },
      {
        name: "password",
        type: "string",
        in: "body",
        required: true,
        example: "shamim.alpha.12",
      },
      {
        name: "password_confirmation",
        type: "string",
        in: "body",
        required: true,
        example: "shamim.alpha.12",
      },
      {
        name: "logo",
        type: "image",
        in: "formData",
        required: false,
        example: "shamim.png",
      },
      
    ],
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
