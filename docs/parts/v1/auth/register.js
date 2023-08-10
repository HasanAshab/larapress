let i = 0;
module.exports = {
  post: {
    summary: "Sign-up a User",
    description: "Returns api token and verification email will be sent to user",
    validationPath: "Auth/Register",
    benchmark: {
      setupRequest(req, context) {
        req.headers["content-type"] = "multipart/form-data";
        req.body = Buffer.from(JSON.stringify({
          username: i + "foo",
          email: i + "foo@gmail.com",
          password: "foo.123456"
        }));
        return req
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
