const User = require(base("app/models/User")).default;

module.exports = {
  post: {
    summary: "Send One Time Password (OTP) code to user's phone number",
    validationPath: "Auth/SendOtp",
    benchmark: {
      async setupContext(){
        return {
          userId: (await User.factory().create())._id
        }
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
