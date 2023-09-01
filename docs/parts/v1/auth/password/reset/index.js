const User = require("~/app/models/User").default;
const Mail = require("~/Mail").default;

module.exports = {
  put: {
    summary: "Reset password",
    validationPath: 'Auth/ResetPassword',
    benchmark: {
      async setupContext(){
        const user = await User.factory().create();
        Mail.mock();
        return { 
          id: user._id,
          token: await user.sendResetPasswordEmail()
        };
      },
      setupRequest(req) {
        req.body = JSON.stringify({
          id: this.id,
          token: this.token,
          password: "Baz@123456"
        });
        return req;
      }
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
          },
        },
      },
    },
  },
};