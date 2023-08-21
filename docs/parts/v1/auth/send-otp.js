const User = require(base("app/models/User")).default;
const Settings = require(base("app/models/Settings")).default;

module.exports = {
  post: {
    summary: "Send One Time Password (OTP) code to user's phone number",
    validationPath: "Auth/SendOtp",
    benchmark: {
      async setupContext(){
        const user = await User.factory().create();
        await Settings.create({
          userId: user._id, 
          twoFactorAuth: { enabled: true }
        });
        return { userId: user._id }
      },
      setupRequest(req) {
        req.body = JSON.stringify({
          userId: this.userId,
          method: "sms"
        });
        return req;
      }
    },
    responses: {
      200: {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" }
          },
        },
      },
    },
  },
};
