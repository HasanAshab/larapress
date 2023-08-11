const FormData = require("form-data");
let i = 0;

module.exports = {
  post: {
    summary: "Sign-up a User",
    description: "Returns api token and verification email will be sent to user",
    validationPath: "Auth/Register",
    benchmark: {
      setupRequest(req, context) {
        const form = new FormData();
        form.append("username", i + "foo");
        form.append("email", i++ + "foo@gmail.com");
        form.append("password", "foo.123456");
        Object.assign(req.headers, form.getHeaders());
        req.body = form.getBuffer();
        return req;
      },    
    },
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
