const User = require(base("app/models/User")).default;
const Mail = require(base("illuminate/utils/Mail")).default;

module.exports = {
  put: {
    summary: "Reset password",
    validationPath: 'Auth/ResetPassword',
    benchmark: {
      async setupContext(){
        const user = await User.findOne();
        Mail.mock();
        return { 
          id: user._id,
          token: await user.sendResetPasswordEmail()
        };
      },
      setupRequest(req) {
        req.body = JSON.stringify({
          id: this.id
          token: this.token,
          password: "baz.123456"
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
