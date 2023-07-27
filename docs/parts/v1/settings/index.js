const User = require(base("app/models/User")).default;
const Settings = require(base("app/models/Settings")).default;

module.exports = {
  get: {
    summary: "Get user settings",
    description: "need auth-token",
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
