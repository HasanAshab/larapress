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
          token: await user.sendResetPasswordEmail()
        };
      },

      body: JSON.stringify({
        token: this.token,
        password: "baz.123456"
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
          },
        },
      },
    },
  },
};
