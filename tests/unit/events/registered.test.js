jest.mock("Notification");

const DB = require("DB").default;
const Notification = require("Notification").default;
const User = require("~/app/models/User").default;
const SendEmailVerificationNotification = require("~/app/listeners/SendEmailVerificationNotification").default;
const SendNewUserJoinedNotificationToAdmins = require("~/app/listeners/SendNewUserJoinedNotificationToAdmins").default;
const NewUserJoinedNotification = require("~/app/notifications/NewUserJoinedNotification").default;
const EmailVerificationNotification = require("~/app/notifications/EmailVerificationNotification").default;

describe("Registered Event", () => {
  let user;

  beforeAll(async () => {
    Notification.mockClear();
    await DB.connect();
    user = await User.factory().unverified().create();
  });

  it("should send verification email", async () => {
    await new SendEmailVerificationNotification().dispatch(user);
    Notification.assertCount(1);
    Notification.assertSentTo(user, EmailVerificationNotification);
  });
  
  it("should notify admins about new user", async () => {
    const admins = await User.factory().count(3).hasSettings().withRole("admin").create();
    await new SendNewUserJoinedNotificationToAdmins().dispatch(user);
    Notification.assertSentTo(admins, NewUserJoinedNotification);
  });
});
