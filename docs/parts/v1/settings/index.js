const User = require(base("app/models/User")).default;
const Settings = require(base("app/models/Settings")).default;

module.exports = {
  get: {
    summary: "Get user settings",
    auth: "novice",
    benchmark: {
      setupContext() {
        return Settings.create({ userId: this.user._id });
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
            data: {
              type: "object",
              example: new Settings({ userId: new User()._id }).toJSON()
            }
          },
        },
      },
    },
  },
};
