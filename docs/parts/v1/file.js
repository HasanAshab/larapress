module.exports = {
  get: {
    summary: "Serve file",
    description: "need signature",
    validationPath: "File/Index",
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
          },
        },
      },
    },
  },
};
