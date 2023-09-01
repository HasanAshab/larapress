const User = require("~/app/models/User").default;
const Settings = require("~/app/models/Settings").default;

module.exports = {
  get: {
    summary: "Get user settings",
    auth: "novice",
    benchmark: {
      setupContext() {
        return Settings.updateOne({ userId: this.user._id }, {}, { upsert: true });
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
