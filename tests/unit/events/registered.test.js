const DB = require("DB").default;
const Notification = require("Notification").default;
const Mail = require("Mail").default;
const User = require("~/app/models/User").default;
const SendEmailVerificationNotification = require("~/app/listeners/SendEmailVerificationNotification").default;
const SendNewUserJoinedNotificationToAdmins = require("~/app/listeners/SendNewUserJoinedNotificationToAdmins").default;

describe("Registered Event", () => {
  let user;

  beforeAll(async () => {
    await DB.connect();
    user = await User.factory().unverified().create();
  });

  it("should send verification email", async () => {
    Mail.mock();
    await new SendEmailVerificationNotification().dispatch(user);
    Mail.assertCount(1);
    Mail.assertSentTo(user.email, "VerificationMail");
  });
  
  it("should notify admins about new user", async () => {
    const admins = await User.factory().count(3).hasSettings().withRole("admin").create();
    Notification.mock();
    await new SendNewUserJoinedNotificationToAdmins().dispatch(user);
    Notification.assertSentTo(admins, "NewUserJoined");
  });
});
