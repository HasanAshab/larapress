const Mail = require("illuminate/utils/Mail").default;
const User = require("app/models/User").default;
const SendEmailVerificationNotification = require("app/listeners/SendEmailVerificationNotification").default;
const SendNewUserJoinedNotificationToAdmins = require("app/listeners/SendNewUserJoinedNotificationToAdmins").default;

describe("Registered Event", () => {
  let user;

  beforeAll(async () => {
    Mail.mock();
  });

  beforeEach(async () => {
      await resetDatabase();
      Mail.mocked.reset();
      user = await User.factory().create();
  });
  

  it("should send verification email", async () => {
    await new SendEmailVerificationNotification().dispatch(user);
    const { total, recipients } = Mail.mocked.data;
    expect(total).toBe(1);
    expect(recipients).toHaveProperty([user.email, "verification"]);
  });

  it("should notify admins about new user", async () => {
    const admins = await User.factory(3).create({ isAdmin: true });
    await new SendNewUserJoinedNotificationToAdmins().dispatch(user);
    const { total, recipients } = Mail.mocked.data;
    expect(total).toBe(3);
    for (admin of admins) {
      expect(recipients).toHaveProperty([admin.email, "newUserJoined"]);
    }
  });
});
